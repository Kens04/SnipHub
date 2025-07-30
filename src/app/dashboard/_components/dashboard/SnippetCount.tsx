"use client";

import { SnippetCountCard } from "./SnippetCountCard";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useEffect, useState } from "react";

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
  const [snippetCount, setSnippetCount] = useState<SnippetCountData>();

  const getSnippetCount = async () => {
    if (!user || !token) {
      return;
    }

    try {
      const res = await fetch(`/api/user/${user.id}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        setSnippetCount(data);
      }
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (token && user?.id) {
      getSnippetCount();
    }
  }, [token, user]);

  return (
    <div className="bg-color-white rounded-lg shadow-md p-5">
      <h2 className="text-xl md:text-2xl font-bold">マイスニペット</h2>
      <div className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-10">
        <SnippetCountCard
          number={snippetCount?.profile.snippetCounts.public || 0}
          text="公開用"
        />
        <SnippetCountCard
          number={snippetCount?.profile.snippetCounts.private || 0}
          text="プライベート用"
        />
        <SnippetCountCard
          number={snippetCount?.profile._count.favorites || 0}
          text="お気に入り"
        />
      </div>
    </div>
  );
};
