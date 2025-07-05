import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { prisma } from "@/utils/prisma";

interface CreateFavoriteRequestBody {
  snippetId: number;
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
    const { snippetId }: CreateFavoriteRequestBody = body;

    // スニペットの存在確認
    const snippet = await prisma.snippet.findUnique({
      where: { id: snippetId },
    });

    if (!snippet) {
      return NextResponse.json(
        { status: "スニペットが見つかりません" },
        { status: 404 }
      );
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_snippetId: {
          userId: user.id,
          snippetId: snippetId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { message: "既にお気に入りしています" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const favorite = await tx.favorite.create({
        data: {
          userId: user.id,
          snippetId: snippetId,
        },
        include: {
          snippet: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (favorite.snippet.userId !== user.id) {
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
    const favorites = await prisma.favorite.findMany({
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

    return NextResponse.json({ status: "OK", favorites }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}
