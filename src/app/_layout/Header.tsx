import Link from "next/link";
import React from "react";
import { FaCode } from "react-icons/fa";

export const Header: React.FC = () => {
  return (
    <header className="bg-white text-[#333] p-6 font-bold flex justify-between items-center fixed z-[1] w-full top-0 left-0">
      <Link href="/" className="flex items-center gap-2">
        <FaCode className="text-color-primary w-8 h-8" />
        <span className="text-4xl">SnipHub</span>
      </Link>
      <div className="flex gap-4 items-center justify-center">
        <Link href="/signup">新規登録</Link>
        <Link
          href="/login"
          className="text-white bg-color-primary hover:bg-color-primary-hover font-bold rounded-lg text-sm px-5 py-2.5 text-center"
        >
          ログイン
        </Link>
      </div>
    </header>
  );
};
