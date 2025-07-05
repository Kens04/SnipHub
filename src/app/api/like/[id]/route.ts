import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";

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

    const existingLike = await prisma.like.findUnique({
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

    if (!existingLike) {
      return NextResponse.json(
        { message: "いいねがありません。" },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const like = await tx.like.delete({
        where: {
          id: parseInt(id),
        },
      });

      if (existingLike.snippet.userId !== user.id) {
        await tx.point.update({
          where: {
            userId: existingLike.snippet.userId,
          },
          data: {
            likeCount: {
              decrement: 1,
            },
            totalPoint: {
              decrement: 1,
            },
          },
        });
      }

      return like;
    });

    return NextResponse.json(
      { status: "OK", message: "いいねを削除しました", result },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
