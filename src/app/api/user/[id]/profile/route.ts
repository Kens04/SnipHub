import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";
import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

interface UpdateUserProfileRequestBody {
  iconUrl: string;
  userName: string;
  bio: string;
  githubUrl: string;
  instagramUrl: string;
  threadsUrl: string;
  xUrl: string;
}

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const userData = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        id: true,
        iconUrl: true,
        userName: true,
        bio: true,
        githubUrl: true,
        instagramUrl: true,
        threadsUrl: true,
        xUrl: true,
        point: {
          select: {
            postCount: true,
            likeCount: true,
            favoriteCount: true,
            totalPoint: true,
          },
        },
        _count: {
          select: {
            favorites: true,
            snippets: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json(
        {
          message: "ユーザーが見つかりません",
        },
        { status: 404 }
      );
    }
    // 公開・非公開スニペット数を取得
    const [publicSnippetCount, privateSnippetCount] = await Promise.all([
      prisma.snippet.count({
        where: {
          userId: parseInt(params.id),
          isPublic: true,
        },
      }),
      prisma.snippet.count({
        where: {
          userId: parseInt(params.id),
          isPublic: false,
        },
      }),
    ]);

    let ranking = null;
    if (userData.point) {
      const pointCount = await prisma.point.count({
        where: {
          totalPoint: {
            gt: userData.point.totalPoint,
          },
        },
      });

      const userRank = pointCount + 1;
      ranking = userRank;
    }

    const profileData = {
      ...userData,
      rank: ranking,
      snippetCounts: {
        total: userData._count.snippets,
        public: publicSnippetCount,
        private: privateSnippetCount,
      },
    };

    return NextResponse.json({
      status: "OK",
      profile: profileData,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { user, error } = await getCurrentUser(request);

  if (error || !user) {
    return NextResponse.json(
      { status: error?.message || "認証が必要です" },
      { status: 401 }
    );
  }

  const { id } = params;

  const userId = parseInt(id);
  if (user.id !== userId) {
    return NextResponse.json({
      message: "他のユーザーのプロフィールは更新できません",
      status: 403,
    });
  }

  const existingProfile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingProfile) {
    return NextResponse.json({
      message: "ユーザーが見つかりません",
      status: 404,
    });
  }

  try {
    const body = await request.json();
    const {
      iconUrl,
      userName,
      bio,
      githubUrl,
      instagramUrl,
      threadsUrl,
      xUrl,
    }: UpdateUserProfileRequestBody = body;

    // ユーザー名の重複チェック
    const duplicateUser = await prisma.user.findFirst({
      where: {
        userName: userName,
        NOT: {
          id: userId,
        },
      },
    });

    if (duplicateUser) {
      return NextResponse.json(
        { message: "そのユーザー名は既に使用されています" },
        { status: 400 }
      );
    }

    const profile = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        iconUrl,
        userName,
        bio,
        githubUrl,
        instagramUrl,
        threadsUrl,
        xUrl,
      },
    });

    return NextResponse.json(
      { status: "OK", message: "プロフィールを更新しました", profile },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
