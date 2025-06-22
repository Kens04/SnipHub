import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const point = await prisma.point.findMany({
      select: {
        id: true,
        user: {
          include: {
            snippets: {
              select: {
                isPublic: true,
                _count: {
                  select: {
                    likes: true,
                    favorites: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ status: "OK", point }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}
