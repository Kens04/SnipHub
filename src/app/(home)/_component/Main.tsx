import Image from "next/image";
import Link from "next/link";
import mainImage from "../../public/images/Coding.png";
import { GuestButton } from "./GuestButton";

export const Main = () => {
  return (
    <div className="flex-col-reverse lg:flex-row flex justify-center items-center gap-5 sm:gap-10">
      <div className="lg:w-2/5">
        <h1 className="text-center lg:text-left font-bold text-xl sm:text-2xl md:text-3xl">
          今すぐコードを、
          <br className="hidden lg:block" />
          スニペット化
          <br />
          どこでも、いつでも管理
        </h1>
        <p className="mt-5 text-color-text-gray">
          コンポーネントを保存・再利用し、実装工数を削減。快適にコードスニペットを
          管理・検索できるプラットフォームです。
        </p>
        <div className="flex gap-2 sm:gap-4 mt-5 md:mt-8 justify-center lg:justify-start">
          <Link
            className="bg-color-primary text-color-white text-sm sm:text-base py-2 md:py-3 px-5 md:px-8 rounded-full inline-block font-bold border border-color-primary hover:bg-transparent hover:text-color-primary transition-colors"
            href="/signup"
          >
            無料ではじめる
          </Link>
          <GuestButton />
        </div>
      </div>
      <div>
        <Image
          className="w-full"
          src={mainImage}
          width={500}
          height={500}
          alt="今すぐコードを、スニペット化どこでも、いつでも管理"
        />
      </div>
    </div>
  );
};
