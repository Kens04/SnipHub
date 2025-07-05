import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { prisma } from "@/utils/prisma";

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

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        id: parseInt(id),
        userId: user.id,
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
          id: parseInt(id),
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
