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

    // 現在のユーザーのSupabaseUserIdを取得
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { supabaseUserId: true },
    });

    // SupabaseUserIdで比較して自分のプロフィールかどうか判定
    const isOwnProfile = currentUser?.supabaseUserId === params.id;

    const snippets = await prisma.user.findUnique({
      where: { supabaseUserId: params.id },
      select: {
        snippets: {
          where: isOwnProfile ? {} : { isPublic: true },
          select: {
            id: true,
            title: true,
            description: true,
            contentMd: true,
            previewCode: true,
            isPublic: true,
            updatedAt: true,
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
