import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../_utils/getCurrentUser";

interface CreateLikeRequestBody {
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

    const { snippetId }: CreateLikeRequestBody = body;

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

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_snippetId: {
          userId: user.id,
          snippetId: snippetId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({
        message: "既にいいねしています",
        status: 400,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const like = await tx.like.create({
        data: {
          userId: user.id,
          snippetId: snippetId,
        },
        include: {
          snippet: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (like.snippet.userId !== user.id) {
        await tx.point.upsert({
          where: {
            userId: like.snippet.userId,
          },
          update: {
            likeCount: {
              increment: 1,
            },
            totalPoint: {
              increment: 1,
            },
          },
          create: {
            userId: like.snippet.userId,
            postCount: 0,
            likeCount: 1,
            favoriteCount: 0,
            totalPoint: 1,
          },
        });
      }

      return like;
    });

    return NextResponse.json({
      status: "OK",
      message: "いいね！しました",
      id: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}
