import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface CreateTagRequestBody {
  id: number;
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, name }: CreateTagRequestBody = body;

    const data = await prisma.tag.create({
      data: {
        id,
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

export async function GET() {
  try {
    const tag = await prisma.tag.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ status: "OK", tag }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}
