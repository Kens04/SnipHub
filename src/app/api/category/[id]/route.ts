import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

interface UpdateCategoryRequestBody {
  name: string;
}

//管理者のみ作成、削除、変更可能にする
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const getCurrentUser = async (request: NextRequest) => {
  // 1) Authorization ヘッダーを取得
  const authHeader = request.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("認証トークンがありません");
  }

  // "Bearer xxx.yyy.zzz" → "xxx.yyy.zzz"
  const token = authHeader.split(" ")[1];

  // 2) JWT でユーザー取得
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    throw new Error("認証に失敗しました");
  }

  // 3) Profle を参照（管理者チェックする場合はここで is_admin を確認）
  const user = await prisma.user.findUnique({
    where: { supabaseUserId: data.user.id },
  });
  if (!user) {
    throw new Error("ユーザー情報が見つかりません");
  }

  return user; // user.isAdmin などがあればこのあと判定
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
    const user = await getCurrentUser(request);
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
          status: "NOT_FOUND",
          message: "カテゴリが見つかりません",
        },
        { status: 404 }
      );
    }

    // 使用中のカテゴリは削除できない
    if (category._count.snippets > 0) {
      return NextResponse.json(
        {
          status: "CATEGORY_IN_USE",
          message: `このカテゴリは${category._count.snippets}個のスニペットで使用されているため削除できません`,
          usageCount: category._count.snippets,
        },
        { status: 400 }
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
    const user = await getCurrentUser(request);
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
