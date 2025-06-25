import { PrismaClient } from "@prisma/client";
// import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface CreateCategoryRequestBody {
  id: number;
  name: string;
}

//管理者のみ作成、削除、変更可能にする
// const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// async function getCurrentUser(token: string) {
//   const { data, error } = await supabaseAdmin.auth.getUser(token);
//   if (error || !data.user) throw new Error("Unauthorized");
//   return data.user;
// }

export async function POST(req: NextRequest) {
  try {
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
