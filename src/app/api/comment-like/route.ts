import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { prisma } from "@/utils/prisma";

interface CreateCommentLikeRequestBody {
  commentId: number;
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

    const { commentId }: CreateCommentLikeRequestBody = body;

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return NextResponse.json({
        message: "コメントが見つかりません。",
        status: 404,
      });
    }

    const alreadyLiked = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId,
        },
      },
    });

    if (alreadyLiked) {
      return NextResponse.json(
        { message: "既にいいねしています。" },
        { status: 400 }
      );
    }

    const data = await prisma.commentLike.create({
      select: {
        id: true,
      },
      data: {
        commentId,
        userId: user.id,
      },
    });

    return NextResponse.json({
      status: "OK",
      message: "コメントにいいね！しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}
