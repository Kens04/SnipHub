"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { StatusCard } from "./StatusCard";
import { useEffect, useState } from "react";

interface StatusData {
  profile: {
    snippetCounts: {
      total: number;
      public: number;
      private: number;
    };
  };
  totalPoint: number;
  rank: number;
}

export const Status: React.FC = () => {
  const { token, user } = useSupabaseSession();
  const [status, setStatus] = useState<StatusData>();

  const getStatus = async () => {
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
        setStatus(data);
      }
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (token && user?.id) {
      getStatus();
    }
  }, [token, user]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-10">
      <StatusCard
        title="総スニペット数"
        number={status?.profile.snippetCounts.total || 0}
        text={
          <p className="mt-1">{`公開: ${status?.profile.snippetCounts.public || 0} / プライベート: ${status?.profile.snippetCounts.private || 0}`}</p>
        }
      />
      <StatusCard
        title="獲得ポイント"
        number={`${status?.totalPoint || 0}pt`}
      />
      <StatusCard
        title="アクティブランキング"
        number={`${status?.rank || "---"}位`}
      />
    </div>
  );
};
