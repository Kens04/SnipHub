import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";
import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

interface addTagRequestBody {
  tagId: number;
}

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { user, error } = await getCurrentUser(request);

  if (error || !user) {
    return NextResponse.json(
      { status: error?.message || "認証が必要です" },
      { status: 401 }
    );
  }

  const { id } = params;
  const snippetId = parseInt(id);

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

    const { tagId }: addTagRequestBody = await request.json();

    const tag = await prisma.tag.findUnique({
      where: {
        id: tagId,
      },
    });

    if (!tag) {
      return NextResponse.json({
        message: "指定されたタグが見つかりません",
        status: 404,
      });
    }

    const existingTag = await prisma.snippetTag.findUnique({
      where: {
        snippetId_tagId: {
          snippetId,
          tagId,
        },
      },
    });

    if (existingTag) {
      return NextResponse.json({
        message: "既にこのタグは追加されています",
        status: 400,
      });
    }

    const snippetTag = await prisma.snippetTag.create({
      data: {
        snippetId,
        tagId,
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

    return NextResponse.json(
      { status: "OK", message: "タグを追加しました", tag: snippetTag.tag },
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

export const GET = async (
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
    const snippetId = parseInt(id);

    const snippet = await prisma.snippet.findUnique({
      where: { id: snippetId },
      select: { id: true },
    });

    if (!snippet) {
      return NextResponse.json(
        { status: "スニペットが見つかりません" },
        { status: 404 }
      );
    }

    const snippetTags = await prisma.snippetTag.findMany({
      where: {
        snippetId,
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

    return NextResponse.json({
      status: "OK",
      tags: snippetTags.map((st) => st.tag),
    });
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
