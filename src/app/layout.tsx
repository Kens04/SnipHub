import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Header } from "./_layout/Header";
import { Footer } from "./_layout/Footer";

export const metadata: Metadata = {
  title: "SnipHub - コードスニペット管理サービス",
  description:
    "フロントエンド開発者向けに、UIコンポーネントを毎回ゼロから実装したり、過去に便利だと感じたコードを探す手間を、ライブプレビュー付きのコードスニペット管理機能で一気に解消する、スニペット管理サービス",
};

const noto = Noto_Sans_JP({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${noto.className} antialiased`}>
        <Toaster />
        <Header />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
