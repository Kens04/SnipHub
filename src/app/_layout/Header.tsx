"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import Image from "next/image";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import avatar from "../public/images/avatar.png";
import { supabase } from "@/utils/supabase";

export interface User {
  userName: string;
  iconUrl: string;
}

export const Header: React.FC = () => {
  const { token, session } = useSupabaseSession();
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user.id) return;
      const res = await fetch(`/api/user/${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };
    if (token) fetchUser();
  }, [token, session]);

  return (
    <header className="bg-color-white text-color-black px-6 py-4 font-bold flex justify-between items-center fixed z-[1] w-full top-0 left-0">
      <Link href="/" className="flex items-center gap-2">
        <FaCode className="text-color-primary w-6 h-6" />
        <span className="text-3xl">SnipHub</span>
      </Link>
      {token ? (
        <div className="flex gap-4 items-center justify-center">
          <div className="relative group">
            <button type="button">
              <Image
                className="w-[50px] h-[50px] rounded-full m-auto"
                src={user?.iconUrl || avatar}
                width={50}
                height={50}
                alt="avatar"
              />
            </button>
            <div
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-color-white shadow-lg ring-1 ring-black/5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex={-1}
            >
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm text-color-black hover:bg-gray-100"
                role="menuitem"
                tabIndex={-1}
                id="user-menu-item-0"
              >
                プロフィール
              </Link>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-color-black hover:bg-gray-100"
                role="menuitem"
                tabIndex={-1}
                id="user-menu-item-1"
              >
                ダッシュボード
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-color-text-white bg-color-primary hover:bg-color-primary-hover font-bold text-sm px-5 py-2.5 text-center w-full"
                role="menuitem"
                tabIndex={-1}
                id="user-menu-item-2"
              >
                サインアウト
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 items-center justify-center">
          <Link href="/signup">新規登録</Link>
          <Link
            href="/login"
            className="text-white bg-color-primary hover:bg-color-primary-hover font-bold rounded-lg text-sm px-5 py-2.5 text-center"
          >
            ログイン
          </Link>
        </div>
      )}
    </header>
  );
};
