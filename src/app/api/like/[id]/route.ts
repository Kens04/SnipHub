import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json();
    const { id } = params;
    const { userId } = body;

    const result = await prisma.$transaction(async (tx) => {
      const like = await tx.like.delete({
        where: {
          id: parseInt(id),
        },
        include: {
          snippet: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (like.snippet.userId !== userId) {
        await tx.point.update({
          where: {
            userId: like.snippet.userId,
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
