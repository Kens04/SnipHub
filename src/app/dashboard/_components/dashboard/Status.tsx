"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { StatusCard } from "./StatusCard";
import { useAuthDataFetch } from "@/app/_hooks/useAuthDataFetch";
import { ProfileStatusData } from "@/app/_types/profile";

export const Status: React.FC = () => {
  const { token, user } = useSupabaseSession();

  const { data, error, isLoading } = useAuthDataFetch<ProfileStatusData>(
    user && token ? `/api/user/${user.id}/profile` : null,
    token
  );

  const StatusValue = () => {
    if (isLoading) {
      return {
        total: "...",
        public: "...",
        private: "...",
        totalPoint: "...",
        rank: "...",
      };
    }
    if (error) {
      return {
        total: "エラー",
        public: "エラー",
        private: "エラー",
        totalPoint: "エラー",
        rank: "エラー",
      };
    }
    if (!data || !data?.profile) {
      return {
        total: "0",
        public: "0",
        private: "0",
        totalPoint: "0",
        rank: "---",
      };
    }

    const { snippetCounts, point, rank } = data.profile;

    return {
      total: snippetCounts.total,
      public: snippetCounts.public,
      private: snippetCounts.private,
      totalPoint: point?.totalPoint || 0,
      rank: rank || "---",
    };
  };

  const displayValues = StatusValue();

  if (error) {
    console.error("Status取得エラー:", error);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-10">
      <StatusCard
        title="総スニペット数"
        number={displayValues.total}
        text={
          <p className="mt-1">{`公開: ${displayValues.public} / プライベート: ${displayValues.private}`}</p>
        }
      />
      <StatusCard
        title="獲得ポイント"
        number={`${displayValues.totalPoint}pt`}
      />
      <StatusCard
        title="アクティブランキング"
        number={`${displayValues.rank}位`}
      />
    </div>
  );
};
