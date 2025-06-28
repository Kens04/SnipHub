import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface CreateCommentLikeRequestBody {
  commentId: number;
  userId: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { commentId, userId }: CreateCommentLikeRequestBody = body;

    const data = await prisma.commentLike.create({
      select: {
        id: true,
      },
      data: {
        comment: {
          connect: {
            id: commentId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
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
