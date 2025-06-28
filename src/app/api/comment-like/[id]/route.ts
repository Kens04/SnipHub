import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    const commentLike = await prisma.commentLike.delete({
      where: {
        id: parseInt(id),
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
