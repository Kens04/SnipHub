import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userId, snippetId } = body;

    const data = await prisma.like.create({
      select: {
        id: true,
      },
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        snippet: {
          connect: {
            id: snippetId,
          },
        },
      },
    });

    return NextResponse.json({
      status: "OK",
      message: "作成しました",
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
    const like = await prisma.like.findMany({
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            iconUrl: true,
          },
        },
        snippet: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json({ status: "OK", like }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}
