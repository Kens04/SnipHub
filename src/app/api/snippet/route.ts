import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
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
    } = body;

    const data = await prisma.snippet.create({
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

    return NextResponse.json({
      status: "OK",
      message: "スニペットを作成しました",
      id: data.id,
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
