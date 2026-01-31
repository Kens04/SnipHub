import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    const { id } = params;
    const snippetId = parseInt(id);

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
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    const { id } = params;
    const snippetId = parseInt(id);

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_snippetId: {
          userId: user.id,
          snippetId: snippetId,
        },
      },
      include: {
        snippet: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!existingLike) {
      return NextResponse.json(
        { message: "いいねがありません。" },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const like = await tx.like.delete({
        where: {
          userId_snippetId: {
            userId: user.id,
            snippetId: snippetId,
          },
        },
      });

      if (existingLike.snippet.userId !== user.id) {
        await tx.point.update({
          where: {
            userId: existingLike.snippet.userId,
          },
          data: {
            likeCount: {
              decrement: 1,
            },
            totalPoint: {
              decrement: 1,
            },
          },
        });
      }

      return like;
    });

    return NextResponse.json(
      { status: "OK", message: "いいねを削除しました", result },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
