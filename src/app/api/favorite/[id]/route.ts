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
          userId,
        },
        include: {
          snippet: {
            select: {
              userId,
            },
          },
        },
      });

      await tx.point.update({
        where: {
          userId: favorite.snippet.userId,
        },
        data: {
          favoriteCount: {
            increment: 1,
          },
          totalPoint: {
            increment: 2,
          },
        },
      });

      return favorite;
    });

    return NextResponse.json({ status: "OK", result }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
