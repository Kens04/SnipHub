import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";
import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { user, error } = await getCurrentUser(request);

    if (error || !user) {
      return NextResponse.json(
        { status: error?.message || "認証が必要です" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (user.id !== parseInt(id)) {
      return NextResponse.json({
        message: "他のユーザーのお気に入りは閲覧できません",
        status: 403,
      });
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!targetUser) {
      return NextResponse.json({
        message: "ユーザーが見つかりません",
        status: 404,
      });
    }

    const favoriteSnippets = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        userName: true,
        favorites: {
          select: {
            id: true,
            createdAt: true,
            snippet: {
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
        },
      },
    });

    return NextResponse.json(favoriteSnippets);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
