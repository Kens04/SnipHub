import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface CreateSnippetRequestBody {
  userId: number;
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
    const body = await req.json();

    const {
      userId,
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
          user: {
            connect: {
              id: userId,
            },
          },
          category: {
            connect: {
              id: categoryId,
            },
          },
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
            userId: userId,
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
            userId: userId,
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

export const GET = async () => {
  try {
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
