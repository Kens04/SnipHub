import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface CreateFavoriteRequestBody {
  snippetId: number;
  userId: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { snippetId, userId }: CreateFavoriteRequestBody = body;

    const result = await prisma.$transaction(async (tx) => {
      const favorite = await tx.favorite.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          snippet: {
            connect: {
              id: snippetId,
            },
          },
        },
        include: {
          snippet: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (favorite.snippet.userId !== userId) {
        await tx.point.update({
          where: {
            userId: favorite.snippet.userId,
          },
          data: {
            favoriteCount: {
              increment: 1,
            },
            totalPoint: {
              increment: 2,
            },
          },
        });
      }
      return favorite;
    });

    return NextResponse.json({
      status: "OK",
      message: "お気に入りに追加しました",
      id: result.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}

export async function GET() {
  try {
    const favorite = await prisma.favorite.findMany({
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            iconUrl: true,
          },
        },
        snippet: {
          select: {
            id: true,
            title: true,
            description: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ status: "OK", favorite }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}
