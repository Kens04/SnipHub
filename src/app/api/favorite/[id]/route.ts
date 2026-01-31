import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { prisma } from "@/utils/prisma";

export const POST = async (
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
    const snippetId = parseInt(id);

    const snippet = await prisma.snippet.findUnique({
      where: {
        id: snippetId,
      },
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
    const snippetId = parseInt(id);

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_snippetId: {
          userId: user.id,
          snippetId: snippetId,
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

    if (!existingFavorite) {
      return NextResponse.json(
        { message: "お気に入りが見つかりません。" },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const favorite = await tx.favorite.delete({
        where: {
          userId_snippetId: {
            userId: user.id,
            snippetId: snippetId,
          },
        },
      });

      if (existingFavorite.snippet.userId !== user.id) {
        await tx.point.update({
          where: {
            userId: existingFavorite.snippet.userId,
          },
          data: {
            favoriteCount: {
              decrement: 1,
            },
            totalPoint: {
              decrement: 2,
            },
          },
        });
      }

      return favorite;
    });

    return NextResponse.json(
      { status: "OK", message: "お気に入りを削除しました", result },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
