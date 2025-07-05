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
      return NextResponse.json({ status: error.message }, { status: 400 });
    }

    const { id } = params;

    const exsistingComment = await prisma.comment.findUnique({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
    });

    if (!exsistingComment) {
      return NextResponse.json(
        { message: "コメントがありません。" },
        { status: 404 }
      );
    }

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
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }

    const body = await request.json();
    const { content } = body;
    const { id } = params;

    const existingComment = await prisma.comment.findUnique({
      where: {
        id: parseInt(id),
        userId: user.id,
      },
    });

    if (!existingComment) {
      return NextResponse.json(
        { message: "コメントがありません。" },
        { status: 404 }
      );
    }

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
