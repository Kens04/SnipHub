import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

interface UpdateSnippetRequestBody {
  title: string;
  description: string;
  contentMd: string;
  previewCode: string;
  isPublic: boolean;
  categoryId: number;
  tagIds: number[];
}

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
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
  const { id } = params;

  try {
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

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const body = await request.json();
    const {
      title,
      description,
      contentMd,
      previewCode,
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
        contentMd,
        previewCode,
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
