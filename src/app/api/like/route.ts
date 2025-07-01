import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface CreateLikeRequestBody {
  snippetId: number;
  userId: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userId, snippetId }: CreateLikeRequestBody = body;

    const result = await prisma.$transaction(async (tx) => {
      const like = await tx.like.create({
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
        include: {
          snippet: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (like.snippet.userId !== userId) {
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
