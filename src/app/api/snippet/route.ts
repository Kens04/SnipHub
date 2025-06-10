import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      title,
      description,
      contentMd,
      previewCode,
      isPublic,
      categoryId,
    } = body;

    const data = await prisma.snippet.create({
      data: {
        title,
        description,
        contentMd,
        previewCode,
        isPublic,
        user: {
          connect: {
            id: userId,
          },
        },
        category: {
          connect: {
            id: categoryId,
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
