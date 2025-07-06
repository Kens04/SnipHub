import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { prisma } from "@/utils/prisma";

interface UpdateCategoryRequestBody {
  name: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(params.id),
      },
      select: {
        id: true,
        name: true,
        snippets: {
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
    });

    return NextResponse.json({ status: "OK", category }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    // 管理者チェック
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        {
          message: "管理者権限が必要です",
        },
        { status: 403 }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        _count: {
          select: {
            snippets: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          message: "カテゴリが見つかりません",
        },
        { status: 404 }
      );
    }

    // 使用中のカテゴリは削除できない
    if (category._count.snippets > 0) {
      return NextResponse.json(
        {
          message: `このカテゴリは${category._count.snippets}個のスニペットで使用されているため削除できません`,
          usageCount: category._count.snippets,
        },
        { status: 409 }
      );
    }

    // 使用されていない場合のみ削除実行
    await prisma.category.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(
      { status: "OK", message: "カテゴリを削除しました", category },
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

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    // 管理者チェック
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        {
          message: "管理者権限が必要です",
        },
        { status: 403 }
      );
    }

    const { name }: UpdateCategoryRequestBody = await request.json();

    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });

    return NextResponse.json(
      { status: "OK", message: "カテゴリー名を更新しました", category },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
