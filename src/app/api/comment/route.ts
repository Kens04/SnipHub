import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../_utils/getCurrentUser";

const prisma = new PrismaClient();

interface CreateCommentRequestBody {
  content: string;
  snippetId: number;
}

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getCurrentUser(req);

    if (error || !user) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }

    const body = await req.json();

    const { snippetId, content }: CreateCommentRequestBody = body;

    const data = await prisma.comment.create({
      data: {
        content,
        userId: user.id,
        snippetId,
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
    const comments = await prisma.comment.findMany({
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

    return NextResponse.json({ status: "OK", comments }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
