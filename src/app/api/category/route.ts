import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { prisma } from "@/utils/prisma";

interface CreateCategoryRequestBody {
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    // 管理者チェック
    const { user, error } = await getCurrentUser(req);

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

    const body = await req.json();
    const { name }: CreateCategoryRequestBody = body;

    const data = await prisma.category.create({
      data: {
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

export const GET = async (request: NextRequest) => {
  try {
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    const categories = await prisma.category.findMany({
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

    return NextResponse.json({ status: "OK", categories }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
