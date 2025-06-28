import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface CreateCommentRequestBody {
  content: string;
  userId: number;
  snippetId: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userId, snippetId, content }: CreateCommentRequestBody = body;

    const data = await prisma.comment.create({
      data: {
        content,
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
      message: "コメントを作成しました",
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
    const comment = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            iconUrl: true,
          },
        },
        _count: {
          select: {
            commentLikes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ status: "OK", comment }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
