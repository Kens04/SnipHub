"use client";

import { useAuthDataFetch } from "@/app/_hooks/useAuthDataFetch";
import { SnippetCountCard } from "./SnippetCountCard";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

interface SnippetCountData {
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

export const SnippetCount: React.FC = () => {
  const { token, user } = useSupabaseSession();

  const { data, error, isLoading } = useAuthDataFetch<SnippetCountData>(
    user && token ? `/api/user/${user.id}/profile` : null,
    token
  );

  if (isLoading) {
    return (
      <div className="bg-color-white rounded-lg shadow-md p-5">
        <h2 className="text-xl md:text-2xl font-bold">マイスニペット</h2>
        <div className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-10">
          <SnippetCountCard number="..." text="公開用" />
          <SnippetCountCard number="..." text="プライベート用" />
          <SnippetCountCard number="..." text="お気に入り" />
        </div>
      </div>
    );
  }

  if (error) {
    console.error("SnippetCount取得エラー:", error);
    return (
      <div className="bg-color-white rounded-lg shadow-md p-5">
        <h2 className="text-xl md:text-2xl font-bold">マイスニペット</h2>
        <div className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-10">
          <SnippetCountCard number="エラー" text="公開用" />
          <SnippetCountCard number="エラー" text="プライベート用" />
          <SnippetCountCard number="エラー" text="お気に入り" />
        </div>
      </div>
    );
  }

  if (!data || !data.profile) {
    return (
      <div className="bg-color-white rounded-lg shadow-md p-5">
        <h2 className="text-xl md:text-2xl font-bold">マイスニペット</h2>
        <div className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-10">
          <SnippetCountCard number="0" text="公開用" />
          <SnippetCountCard number="0" text="プライベート用" />
          <SnippetCountCard number="0" text="お気に入り" />
        </div>
      </div>
    );
  }

  const { snippetCounts, _count } = data.profile;

  return (
    <div className="bg-color-white rounded-lg shadow-md p-5">
      <h2 className="text-xl md:text-2xl font-bold">マイスニペット</h2>
      <div className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-10">
        <SnippetCountCard number={snippetCounts.public} text="公開用" />
        <SnippetCountCard
          number={snippetCounts.private}
          text="プライベート用"
        />
        <SnippetCountCard number={_count.favorites} text="お気に入り" />
      </div>
    </div>
  );
};
