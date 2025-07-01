import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface CreateCategoryRequestBody {
  id: number;
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
    console.log(error);
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

export async function POST(req: NextRequest) {
  try {
    // 管理者チェック
    const user = await getCurrentUser(req);
    if (!user.isAdmin) {
      return NextResponse.json(
        {
          message: "管理者権限が必要です",
        },
        { status: 403 }
      );
    }
    const body = await req.json();
    const { id, name }: CreateCategoryRequestBody = body;

    const data = await prisma.category.create({
      data: {
        id,
        name,
      },
    });

    return NextResponse.json({
      status: "OK",
      message: "カテゴリーを作成しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}

export const GET = async () => {
  try {
    const category = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        snippets: {
          select: {
            categoryId: true,
            title: true,
            description: true,
            likes: {
              select: {
                snippetId: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ status: "OK", category }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
