import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../_utils/getCurrentUser";

interface CreateTagRequestBody {
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getCurrentUser(req);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { name }: CreateTagRequestBody = body;

    const existingTag = await prisma.tag.findUnique({
      where: {
        name: name,
      },
    });

    if (existingTag) {
      return NextResponse.json({
        message: "既に同じ名前のタグがあります。",
        status: 400,
      });
    }

    const data = await prisma.tag.create({
      data: {
        name,
      },
    });

    return NextResponse.json({
      status: "OK",
      message: "タグを作成しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    const tags = await prisma.tag.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ status: "OK", tags }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}
