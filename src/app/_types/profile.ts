export interface ProfileData {
  id: number;
  iconUrl: string | null;
  userName: string;
  bio: string | null;
  githubUrl: string | null;
  instagramUrl: string | null;
  threadsUrl: string | null;
  xUrl: string | null;
  point: {
    postCount: number;
    likeCount: number;
    favoriteCount: number;
    totalPoint: number;
  } | null;
  _count: {
    favorites: number;
    snippets: number;
  };
  rank: number | null;
  snippetCounts: {
    total: number;
    public: number;
    private: number;
  };
}

export interface ProfileResponse {
  status: string;
  profile: ProfileData;
}

export interface ProfileStatusData {
  profile: {
    snippetCounts: {
      total: number;
      public: number;
      private: number;
    };
    point: {
      totalPoint: number;
    } | null;
    rank: number | null;
  };
}

export interface ProfileSnippetCountData {
  profile: {
    snippetCounts: {
      public: number;
      private: number;
    };
    _count: {
      favorites: number;
    };
  };
}
