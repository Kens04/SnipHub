import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UpdateTagRequestBody {
  name: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tag = await prisma.tag.findUnique({
      where: {
        id: parseInt(params.id),
      },
      select: {
        id: true,
        name: true,
        snippetTags: {
          select: {
            snippet: {
              select: {
                id: true,
                userId: true,
                title: true,
                description: true,
                isPublic: true,
                user: {
                  select: {
                    id: true,
                    userName: true,
                    iconUrl: true,
                  },
                },
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                tags: {
                  select: {
                    tag: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                _count: {
                  select: {
                    likes: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ status: "OK", tag }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { name }: UpdateTagRequestBody = await request.json();

  try {
    const tag = await prisma.tag.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });

    return NextResponse.json(
      { status: "OK", message: "タグを更新しました", tag },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const tag = await prisma.tag.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            snippetTags: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json(
        {
          status: "NOT_FOUND",
          message: "タグが見つかりません",
        },
        { status: 404 }
      );
    }

    // 使用中のタグは削除できない
    if (tag._count.snippetTags > 0) {
      return NextResponse.json(
        {
          status: "TAG_IN_USE",
          message: `このタグは${tag._count.snippetTags}個のスニペットで使用されているため削除できません`,
          usageCount: tag._count.snippetTags,
        },
        { status: 400 }
      );
    }

    // 使用されていない場合のみ削除実行
    await prisma.tag.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(
      { status: "OK", message: "タグを削除しました", tag },
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
