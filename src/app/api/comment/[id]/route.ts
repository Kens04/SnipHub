import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(id),
      },
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
    });

    return NextResponse.json({ status: "OK", comment }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
