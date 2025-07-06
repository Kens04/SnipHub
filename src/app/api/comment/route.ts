import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { prisma } from "@/utils/prisma";

interface CreateCommentRequestBody {
  content: string;
  snippetId: number;
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

    const { snippetId, content }: CreateCommentRequestBody = body;

    const snippet = await prisma.snippet.findUnique({
      where: {
        id: snippetId,
      },
    });

    if (!snippet) {
      return NextResponse.json({
        message: "スニペットが見つかりません",
        status: 404,
      });
    }

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

export const GET = async (request: NextRequest) => {
  try {
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

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
