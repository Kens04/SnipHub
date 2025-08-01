"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { StatusCard } from "./StatusCard";
import { useAuthDataFetch } from "@/app/_hooks/useAuthDataFetch";

interface StatusData {
  profile: {
    snippetCounts: {
      total: number;
      public: number;
      private: number;
    };
    point: {
      totalPoint: number;
    };
    rank: number;
  };
}

export const Status: React.FC = () => {
  const { token, user } = useSupabaseSession();

  const { data, error, isLoading } = useAuthDataFetch<StatusData>(
    user && token ? `/api/user/${user.id}/profile` : null,
    token
  );

  if (error) {
    console.log(error);
  }

  if (!data) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-10">
        <StatusCard
          title="総スニペット数"
          number="---"
          text={<p className="mt-1">公開: --- / プライベート: ---</p>}
        />
        <StatusCard title="獲得ポイント" number="---" />
        <StatusCard title="アクティブランキング" number="---" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-10">
        <StatusCard
          title="総スニペット数"
          number="0"
          text={<p className="mt-1">公開: 0 / プライベート: 0</p>}
        />
        <StatusCard title="獲得ポイント" number="0pt" />
        <StatusCard title="アクティブランキング" number="---位" />
      </div>
    );
  }

  const { snippetCounts, point, rank } = data.profile;

  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-10">
      <StatusCard
        title="総スニペット数"
        number={snippetCounts.total}
        text={
          <p className="mt-1">{`公開: ${snippetCounts.public} / プライベート: ${snippetCounts.private}`}</p>
        }
      />
      <StatusCard title="獲得ポイント" number={`${point.totalPoint || 0}pt`} />
      <StatusCard title="アクティブランキング" number={`${rank || "---"}位`} />
    </div>
  );
};
