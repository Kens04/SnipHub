import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { Prisma } from "@prisma/client";

interface ContentBlockInput {
  type: "markdown" | "text" | "preview";
  content: string;
  order: number;
  template?: string;
  files?: Record<string, { code: string }>;
}

interface blockData {
  type: string;
  order: number;
  content?: string | null;
  preview?: Prisma.ContentPreviewCreateNestedOneWithoutContentBlockInput;
}

interface UpdateSnippetRequestBody {
  title: string;
  description: string;
  contentBlocks: ContentBlockInput[];
  isPublic: boolean;
  categoryId: number;
  tagIds: number[];
}

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    const { id } = params;
    const snippet = await prisma.snippet.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            iconUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        contentBlocks: {
          select: {
            id: true,
            type: true,
            content: true,
            order: true,
            preview: {
              select: {
                template: true,
                files: true,
              },
            },
          },
        },
        comments: {
          select: {
            snippetId: true,
            content: true,
            user: {
              select: {
                id: true,
                userName: true,
                iconUrl: true,
              },
            },
            commentLikes: {
              select: {
                id: true,
                userId: true,
                commentId: true,
              },
            },
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
            snippetId: true,
          },
        },
        favorites: {
          select: {
            id: true,
            userId: true,
            snippetId: true,
          },
        },
      },
    });

    return NextResponse.json({ status: "OK", snippet }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    const { id } = params;

    const existingSnippet = await prisma.snippet.findUnique({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
    });

    if (!existingSnippet) {
      return NextResponse.json(
        { message: "スニペットがありません。" },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.commentLike.deleteMany({
        where: {
          comment: {
            snippetId: parseInt(id),
          },
        },
      });

      await tx.comment.deleteMany({
        where: {
          snippetId: parseInt(id),
        },
      });

      await tx.like.deleteMany({
        where: {
          snippetId: parseInt(id),
        },
      });

      await tx.snippetTag.deleteMany({
        where: {
          snippetId: parseInt(id),
        },
      });

      await tx.favorite.deleteMany({
        where: {
          snippetId: parseInt(id),
        },
      });

      const snippet = await tx.snippet.delete({
        where: {
          id: parseInt(id),
        },
        include: {
          category: {
            select: {
              id: true,
            },
          },
          tags: {
            select: {
              id: true,
            },
          },
        },
      });

      if (snippet.isPublic) {
        await tx.point.update({
          where: {
            userId: snippet.userId,
          },
          data: {
            postCount: {
              decrement: 1,
            },
            totalPoint: {
              decrement: 3,
            },
          },
        });
      }
    });

    return NextResponse.json(
      { status: "OK", message: "スニペットを削除しました", result },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    const { id } = params;

    const body = await request.json();

    const { isPublic }: UpdateSnippetRequestBody = body;
    const snippetIsVisible = await prisma.snippet.update({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
      data: {
        isPublic,
      },
    });

    return NextResponse.json(
      {
        status: "OK",
        message: isPublic
          ? "スニペットを公開にしました"
          : "スニペットを非公開にしました",
        snippetIsVisible,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    const { id } = params;

    const existingSnippet = await prisma.snippet.findUnique({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
    });

    if (!existingSnippet) {
      return NextResponse.json(
        { message: "スニペットが見つかりません" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      contentBlocks,
      isPublic,
      categoryId,
      tagIds,
    }: UpdateSnippetRequestBody = body;
    const snippet = await prisma.snippet.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        description,
        contentBlocks: {
          deleteMany: {},
          create: contentBlocks.map((block) => {
            const blockData: blockData = {
              type: block.type,
              order: block.order,
              content: block.type === "preview" ? null : block.content,
            };

            if (block.type === "preview" && block.files) {
              blockData.preview = {
                create: {
                  template: block.template || "react-ts",
                  files: {
                    create: Object.entries(block.files).map(
                      ([filePath, file]) => ({
                        filePath: filePath,
                        code: file.code,
                      })
                    ),
                  },
                },
              };
            }
            return blockData;
          }),
        },
        isPublic,
        categoryId,
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId: number) => ({
            tag: {
              connect: {
                id: tagId,
              },
            },
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            userName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(
      { status: "OK", message: "スニペットを更新しました", snippet },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
