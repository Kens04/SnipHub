"use client";

import { Sidebar } from "../_layout/Sidebar";
import { useRouteGuard } from "./_hooks/useRouteGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteGuard();

  return (
    <>
      {/* サイドバー */}
      <Sidebar />

      {/* メインエリア */}
      <div className="mt-[72px] md:ml-[280px] md:mt-[88px] p-4 md:px-8 md:py-20 min-h-screen">
        {children}
      </div>
    </>
  );
}
