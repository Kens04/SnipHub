import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../_utils/getCurrentUser";

interface CreateSnippetRequestBody {
  title: string;
  description: string;
  contentMd: string;
  previewCode: string;
  isPublic: boolean;
  categoryId: number;
  tagIds: number[];
}

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getCurrentUser(req);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      title,
      description,
      contentMd,
      previewCode,
      isPublic,
      categoryId,
      tagIds,
    }: CreateSnippetRequestBody = body;

    const result = await prisma.$transaction(async (tx) => {
      const snippet = await tx.snippet.create({
        data: {
          title,
          description,
          contentMd,
          previewCode,
          isPublic,
          userId: user.id,
          categoryId,
          tags: {
            create: tagIds.map((tagId: number) => ({
              tag: {
                connect: {
                  id: tagId,
                },
              },
            })),
          },
        },
      });

      if (isPublic) {
        await tx.point.upsert({
          where: {
            userId: user.id,
          },
          update: {
            postCount: {
              increment: 1,
            },
            totalPoint: {
              increment: 3,
            },
          },
          create: {
            userId: user.id,
            postCount: 1,
            likeCount: 0,
            favoriteCount: 0,
            totalPoint: 3,
          },
        });
      }

      return snippet;
    });

    return NextResponse.json({
      status: "OK",
      message: "スニペットを作成しました",
      id: result.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}

export const GET = async (request: NextRequest) => {
  try {
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }
    const snippet = await prisma.snippet.findMany({
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
        likes: {
          select: {
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
