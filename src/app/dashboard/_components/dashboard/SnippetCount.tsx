"use client";

import { useAuthDataFetch } from "@/app/_hooks/useAuthDataFetch";
import { SnippetCountCard } from "./SnippetCountCard";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { ProfileSnippetCountData } from "@/app/_types/profile";

export const SnippetCount: React.FC = () => {
  const { token, user } = useSupabaseSession();

  const { data, error, isLoading } = useAuthDataFetch<ProfileSnippetCountData>(
    user && token ? `/api/user/${user.id}/profile` : null,
    token
  );

  const SnippetCountValue = () => {
    if (isLoading) {
      return {
        public: "...",
        private: "...",
        favorites: "...",
      };
    }
    if (error) {
      return {
        public: "エラー",
        private: "エラー",
        favorites: "エラー",
      };
    }

    if (!data || !data?.profile) {
      return {
        public: "0",
        private: "0",
        favorites: "0",
      };
    }

    const { snippetCounts, _count } = data.profile;

    return {
      public: snippetCounts.public,
      private: snippetCounts.private,
      favorites: _count.favorites,
    };
  };

  const displayValues = SnippetCountValue();

  if (error) {
    console.error("SnippetCount取得エラー:", error);
  }

  return (
    <div className="bg-color-white rounded-lg shadow-md p-5">
      <h2 className="text-xl md:text-2xl font-bold">マイスニペット</h2>
      <div className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-10">
        <SnippetCountCard number={displayValues.public} text="公開用" />
        <SnippetCountCard
          number={displayValues.private}
          text="プライベート用"
        />
        <SnippetCountCard number={displayValues.favorites} text="お気に入り" />
      </div>
    </div>
  );
};
