import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

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
          status: "NOT_FOUND",
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
  const { id } = params;

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
    const profile = await prisma.user.update({
      where: {
        id: parseInt(id),
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
