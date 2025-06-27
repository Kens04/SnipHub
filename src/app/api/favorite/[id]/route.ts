import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json();
    const { id } = params;
    const { userId } = body;
    const result = await prisma.$transaction(async (tx) => {
      const favorite = await tx.favorite.delete({
        where: {
          id: parseInt(id),
        },
        include: {
          snippet: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (favorite.snippet.userId !== userId) {
        await tx.point.update({
          where: {
            userId: favorite.snippet.userId,
          },
          data: {
            favoriteCount: {
              decrement: 1,
            },
            totalPoint: {
              decrement: 2,
            },
          },
        });
      }

      return favorite;
    });

    return NextResponse.json(
      { status: "OK", message: "お気に入りを削除しました", result },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
