"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaCode } from "react-icons/fa";
import Image from "next/image";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import avatar from "../public/images/avatar.png";
import { supabase } from "@/utils/supabase";
import { User } from "../_types/user";
import { useDataFetch } from "../_hooks/useDataFetch";
import { SidebarItems } from "../_components/SidebarItems";
import { RxCross2 } from "react-icons/rx";
import { RxHamburgerMenu } from "react-icons/rx";

export const Header: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { token, session } = useSupabaseSession();
  const { data, error, isLoading } = useDataFetch<User>(
    session?.user.id ? `/api/user/${session?.user.id}` : null
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (error) return <div>ユーザー情報の読み込みに失敗しました</div>;

  return (
    <header className="bg-color-white text-color-black px-4 md:px-6 py-4 font-bold flex justify-between items-center fixed z-[1] w-full top-0 left-0 md:h-[88px]">
      <Link href="/" className="flex items-center gap-2">
        <FaCode className="text-color-primary w-4 h-4 md:w-6 md:h-6" />
        <span className="text-2xl md:text-3xl">SnipHub</span>
      </Link>
      <div>
        {token ? (
          <div className="flex gap-4 items-center justify-center w-[40px] h-[40px] md:w-[50px] md:h-[50px]">
            <div className="relative group">
              <button className="hidden md:block" type="button">
                {isLoading ? (
                  <Image
                    className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full m-auto"
                    src={avatar}
                    width={50}
                    height={50}
                    alt="avatar"
                  />
                ) : (
                  <Image
                    className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full m-auto"
                    src={data?.iconUrl || avatar}
                    width={50}
                    height={50}
                    alt="avatar"
                  />
                )}
              </button>
              <button
                className="md:hidden"
                type="button"
                onClick={() => setShowMenu(!showMenu)}
              >
                {showMenu ? (
                  <RxCross2 className="w-8 h-8" />
                ) : (
                  <RxHamburgerMenu className="w-8 h-8" />
                )}
              </button>
              <div
                className="hidden md:block absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-color-white shadow-lg ring-1 ring-black/5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
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
                  className="text-white bg-color-primary hover:bg-color-primary-hover font-bold text-sm px-5 py-2.5 text-center w-full"
                  role="menuitem"
                  tabIndex={-1}
                  id="user-menu-item-2"
                >
                  ログアウト
                </button>
              </div>

              <div
                className={`md:hidden ${
                  showMenu && "fixed inset-0 bg-white z-50 top-[72px]"
                }`}
              >
                {showMenu && (
                  <nav className="p-4 border-t">
                    <ul>
                      {SidebarItems.map((SidebarItem) => {
                        return (
                          <li className="border-b" key={SidebarItem.id}>
                            <Link
                              href={SidebarItem.href}
                              className="p-4 flex gap-2 items-center hover:bg-gray-100"
                              onClick={() => setShowMenu(false)}
                            >
                              {SidebarItem.icon}
                              {SidebarItem.link}
                            </Link>
                          </li>
                        );
                      })}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="text-white bg-color-primary hover:bg-color-primary-hover font-bold text-sm px-5 py-2.5 text-center w-full mt-4"
                      >
                        ログアウト
                      </button>
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 md:gap-4 items-center justify-center">
            <Link className="text-sm" href="/signup">
              新規登録
            </Link>
            <Link
              href="/login"
              className="text-white bg-color-primary hover:bg-color-primary-hover font-bold rounded-md md:rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 text-center"
            >
              ログイン
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
