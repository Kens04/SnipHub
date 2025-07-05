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

    // いいねがあるかチェック
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId: parseInt(id),
        },
      },
    });

    // いいねがない場合はエラー
    if (!existingLike) {
      return NextResponse.json(
        { message: "いいねしていません。" },
        { status: 404 }
      );
    }

    // いいねの削除
    const commentLike = await prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId: parseInt(id),
        },
      },
    });

    return NextResponse.json(
      { status: "OK", message: "コメントのいいねを削除しました", commentLike },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
