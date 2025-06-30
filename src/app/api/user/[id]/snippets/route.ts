import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const snippets = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        snippets: {
          select: {
            id: true,
            title: true,
            description: true,
            contentMd: true,
            previewCode: true,
            isPublic: true,
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
            comments: {
              select: {
                id: true,
                content: true,
                user: {
                  select: {
                    id: true,
                    userName: true,
                    iconUrl: true,
                  },
                },
                commentLikes: {
                  select: {
                    id: true,
                    commentId: true,
                  },
                },
              },
            },
            likes: {
              select: {
                id: true,
                snippetId: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(snippets);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
