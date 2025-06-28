import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    const comment = await prisma.comment.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(
      { status: "OK", message: "コメントを削除しました", comment },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json();
    const { content } = body;
    const { id } = params;

    const comment = await prisma.comment.update({
      where: {
        id: parseInt(id),
      },
      data: {
        content,
      },
    });

    return NextResponse.json(
      { status: "OK", message: "コメントを更新しました", comment },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
