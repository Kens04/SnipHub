import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";
import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string; tagId: string } }
) => {
  const { user, error } = await getCurrentUser(request);

  if (error || !user) {
    return NextResponse.json(
      { status: error?.message || "認証が必要です" },
      { status: 401 }
    );
  }

  const { id, tagId } = params;
  const snippetId = parseInt(id);
  const tagIdNum = parseInt(tagId);

  try {
    const snippet = await prisma.snippet.findUnique({
      where: {
        id: snippetId,
        userId: user.id,
      },
    });

    if (!snippet) {
      return NextResponse.json(
        {
          message: "スニペットが見つかりません",
        },
        { status: 404 }
      );
    }

    const snippetTag = await prisma.snippetTag.findUnique({
      where: {
        snippetId_tagId: {
          snippetId,
          tagId: tagIdNum,
        },
      },
      include: {
        tag: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!snippetTag) {
      return NextResponse.json({
        message: "指定されたタグは追加されていません",
        status: 404,
      });
    }

    await prisma.snippetTag.delete({
      where: {
        snippetId_tagId: {
          snippetId,
          tagId: tagIdNum,
        },
      },
    });

    return NextResponse.json(
      { status: "OK", message: "タグを解除しました", tag: snippetTag.tag },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        {
          status: error.message,
        },
        { status: 400 }
      );
  }
};
