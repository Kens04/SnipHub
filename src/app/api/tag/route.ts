import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, name } = body;

    const data = await prisma.tag.create({
      data: {
        id,
        name,
      },
    });

    return NextResponse.json({
      status: "OK",
      message: "作成しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}

export async function GET() {
  try {
    const tag = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        snippetTags: {
          select: {
            snippet: {
              select: {
                id: true,
                userId: true,
                title: true,
                description: true,
                user: {
                  select: {
                    id: true,
                    userName: true,
                    iconUrl: true,
                  },
                },
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                tags: {
                  select: {
                    tag: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                likes: {
                  select: {
                    id: true,
                    userId: true,
                    snippetId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ status: "OK", tag }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
}
