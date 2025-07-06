"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import Image from "next/image";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import avatar from "../public/images/avatar.png";

export interface User {
  userName: string;
  iconUrl: string;
}

export const Header = () => {
  const { token, session } = useSupabaseSession();
  const [user, setUser] = useState<User | null>(null);

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
    <header className="bg-white text-[#333] px-6 py-4 font-bold flex justify-between items-center fixed z-[1] w-full top-0 left-0">
      <Link href="/" className="flex items-center gap-2">
        <FaCode className="text-color-primary w-6 h-6" />
        <span className="text-3xl">SnipHub</span>
      </Link>
      {token ? (
        <div className="flex gap-4 items-center justify-center">
          <Image
            className="w-[50px] h-[50px] rounded-full m-auto"
            src={user?.iconUrl || avatar}
            width={50}
            height={50}
            alt="avatar"
          />
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
