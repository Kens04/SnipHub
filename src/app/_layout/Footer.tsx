import { FaCode } from "react-icons/fa";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-color-primary relative z-10">
      <div className="p-4 md:px-8 md:py-5">
        <Link href="/" className="flex items-center gap-2">
          <FaCode className="text-color-accent w-4 h-4 md:w-6 md:h-6" />
          <span className="text-xl text-white">SnipHub</span>
        </Link>
        <p className="text-white text-[12px] md:text-sm mt-1 md:mt-2">
          コードスニペット管理のための最高のツール
        </p>
        <nav className="mt-5">
          <ul className="flex flex-wrap justify-center gap-2">
            <li>
              <Link
                className="text-sm md:text-base text-white hover:underline transition"
                href="/"
              >
                ホーム
              </Link>
            </li>
            <li>
              <Link
                className="text-sm md:text-base text-white hover:underline transition"
                href="/snippets"
              >
                スニペット一覧
              </Link>
            </li>
            <li>
              <Link
                className="text-sm md:text-base text-white hover:underline transition"
                href="/active-user"
              >
                ランキング
              </Link>
            </li>
            <li>
              <Link
                className="text-sm md:text-base text-white hover:underline transition"
                href="/contact"
              >
                お問い合わせ
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-4">
          <Link href="https://www.instagram.com/kensan57">
            <FaInstagram className="text-white w-8 h-8 m-auto" />
          </Link>
        </div>
      </div>
      <hr className="bg-white" />
      <div className="px-8 py-4 text-center">
        <span className="text-white text-sm md:text-base">
          2025 SnipHub. All rights reserved.
        </span>
      </div>
    </footer>
  );
};
