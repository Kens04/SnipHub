import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const points = await prisma.point.findMany({
      take: 10,
      orderBy: [{ totalPoint: "desc" }, { updatedAt: "desc" }],
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

    const ranking = points.map((point, index) => ({
      ...point,
      rank: index + 1,
    }));

    return NextResponse.json({ status: "OK", ranking }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}
