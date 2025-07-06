import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../_utils/getCurrentUser";

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

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
