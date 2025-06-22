import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const calculateUserPoints = async (userId: number) => {
  const [postCount, likeCount, favoriteCount] = await Promise.all([
    prisma.snippet.count({
      where: {
        userId,
        isPublic: true,
      },
    }),
    prisma.like.count({
      where: {
        snippet: {
          userId,
          isPublic: true,
        },
      },
    }),
    prisma.favorite.count({
      where: {
        snippet: {
          userId,
          isPublic: true,
        },
      },
    }),
  ]);

  const totalPoint = postCount * 3 + likeCount * 1 + favoriteCount * 2;

  return {
    postCount,
    likeCount,
    favoriteCount,
    totalPoint,
  };
};

export async function GET({ params }: { params: { id: string } }) {
  try {
    const userId = Number(params.id);

    let point = await prisma.point.findUnique({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            iconUrl: true,
          },
        },
      },
    });

    if (!point) {
      const createPoint = await calculateUserPoints(userId);

      point = await prisma.point.create({
        data: {
          userId,
          ...createPoint,
        },
        include: {
          user: {
            select: {
              id: true,
              userName: true,
              iconUrl: true,
            },
          },
        },
      });
    }

    const currentStats = await calculateUserPoints(userId);

    return NextResponse.json(
      {
        status: "OK",
        data: {
          userId,
          user: point.user,
          points: {
            postCount: point.postCount,
            likeCount: point.likeCount,
            favoriteCount: point.favoriteCount,
          },
          currentStats,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    const calculatedStats = await calculateUserPoints(userId);

    const point = await prisma.point.upsert({
      where: { userId },
      update: calculatedStats,
      create: {
        userId,
        ...calculatedStats,
      },
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            iconUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: "OK",
      message: "ポイントを更新しました",
      data: point,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}
