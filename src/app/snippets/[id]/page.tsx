"use client";

import { useDataFetch } from "@/app/_hooks/useDataFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { SnippetData } from "@/app/_types/snippet";
import { ContentBlock } from "@/app/dashboard/snippets/new/_types/contentBlock";
import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaThreads } from "react-icons/fa6";
import { ContentBlockDisplay } from "@/app/dashboard/snippets/[id]/_components/ContentBlockDisplay";
import toast from "react-hot-toast";
import Link from "next/link";

interface CurrentUserSummary {
  id: number;
  userName: string;
  iconUrl: string;
}

type PreviewFiles = NonNullable<
  NonNullable<
    SnippetData["snippet"]["contentBlocks"][number]["preview"]
  >["files"]
>;

const normalizePreviewFiles = (
  files?: PreviewFiles,
): Record<string, { code: string }> => {
  if (!files) {
    return {};
  }

  if (Array.isArray(files)) {
    return files.reduce<Record<string, { code: string }>>((acc, file) => {
      acc[file.filePath] = { code: file.code };
      return acc;
    }, {});
  }

  return files;
};

const SnippetDetail = ({ params }: { params: { id: string } }) => {
  const { token, user } = useSupabaseSession();
  const { data, isLoading, mutate } = useDataFetch<SnippetData>(
    `/api/snippet/${params.id}`,
  );
  const { data: currentUser } = useDataFetch<CurrentUserSummary>(
    user?.id ? `/api/user/${user.id}` : null,
  );

  const currentUserId = currentUser?.id;

  const handleFavorite = async (snippetId: number, isFavorited: boolean) => {
    if (!token || !currentUserId) {
      toast.error("ログインしてください");
      return;
    }

    try {
      if (isFavorited) {
        const res = await fetch(`/api/favorite/${snippetId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          toast.success("お気に入りを解除しました！");
          mutate();
        } else {
          toast.error("お気に入り解除に失敗しました！");
        }
      } else {
        const res = await fetch(`/api/favorite/${snippetId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          toast.success("お気に入りしました！");
          mutate();
        } else {
          toast.error("お気に入りに失敗しました！");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (snippetId: number, isLiked: boolean) => {
    if (!token || !currentUserId) {
      toast.error("ログインしてください");
      return;
    }

    try {
      if (isLiked) {
        const res = await fetch(`/api/like/${snippetId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          toast.success("いいねを解除しました！");
          mutate();
        } else {
          toast.error("いいね解除に失敗しました！");
        }
      } else {
        const res = await fetch(`/api/like/${snippetId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          toast.success("いいねしました！");
          mutate();
        } else {
          toast.error("いいねに失敗しました！");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (!data) {
    return "スニペットの情報が取得できませんでした。";
  }

  const snippet = data.snippet;

  // 現在のユーザーがお気に入りに追加しているかチェック
  const isFavorited = currentUserId
    ? snippet.favorites.some((favorite) => favorite.userId === currentUserId)
    : false;

  const isLiked = currentUserId
    ? snippet.likes.some((like) => like.userId === currentUserId)
    : false;

  const sortedContentBlocks: ContentBlock[] = [...snippet.contentBlocks]
    .sort((a, b) => a.order - b.order)
    .map((block) => ({
      ...block,
      content: block.content || "",
      ...(block.type === "preview"
        ? {
            code: block.preview?.code || "",
            template: block.preview?.template as ContentBlock["template"],
            files: normalizePreviewFiles(block.preview?.files),
          }
        : {}),
    }));

  return (
    <div className="mt-20 md:mt-0">
      <h2 className="text-left text-color-text-black text-2xl md:text-3xl font-bold">
        {snippet.title}
      </h2>
      <div className="flex flex-wrap mt-4">
        <div className="text-color-text-gray">
          <span>投稿日：</span>
          <span>{new Date(snippet.createdAt).toLocaleDateString("ja-JP")}</span>
        </div>
        <span className="text-color-text-gray">｜</span>
        <div className="text-color-text-gray">
          <span>最終更新日：</span>
          <span>{new Date(snippet.updatedAt).toLocaleDateString("ja-JP")}</span>
        </div>
      </div>
      <div className="mt-8">
        <div className="text-xl font-bold mb-2">カテゴリ</div>
        <div>
          <span className="bg-color-category text-color-white inline-block py-1 px-2 rounded-full font-medium text-sm">
            {snippet.category.name}
          </span>
        </div>
      </div>
      <div className="mt-8">
        <div className="text-xl font-bold mb-2">タグ</div>
        <div className="flex flex-wrap gap-2">
          {snippet.tags.map((tag) => (
            <span
              key={tag.tag.id}
              className="bg-color-tag text-color-white inline-block py-1 px-2 rounded-full font-medium text-sm"
            >
              #{tag.tag.name}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap mt-5">
        <div>
          <button
            type="button"
            onClick={() =>
              handleFavorite(snippet.id, isFavorited)
            }
          >
            {isFavorited ? (
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400 w-4 h-4 md:w-6 md:h-6" />
                {snippet.favorites.length}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <FaRegStar className="text-yellow-400 w-4 h-4 md:w-6 md:h-6" />
                {snippet.favorites.length}
              </div>
            )}
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() =>
              handleLike(snippet.id, isLiked)
            }
          >
            {isLiked ? (
              <div className="flex items-center gap-1">
                <FaHeart className="text-color-danger w-4 h-4 md:w-6 md:h-6" />
                {snippet.likes.length}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <FaRegHeart className="text-color-danger w-4 h-4 md:w-6 md:h-6" />
                {snippet.likes.length}
              </div>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">シェア：</span>
          <button
            type="button"
            onClick={() => {
              const url = `https://x.com/intent/tweet?text=${encodeURIComponent(
                `${snippet.title}\n${window.location.href}`,
              )}`;
              window.open(url, "_blank", "noopener,noreferrer");
            }}
            className="hover:opacity-70 transition-opacity"
            aria-label="Xでシェア"
          >
            <FaXTwitter className="text-color-text-black w-4 h-4 md:w-6 md:h-6" />
          </button>
          <button
            type="button"
            onClick={() => {
              const url = `https://threads.com/intent/post?text=${encodeURIComponent(
                `${snippet.title} ${window.location.href}`,
              )}`;
              window.open(url, "_blank", "noopener,noreferrer");
            }}
            className="hover:opacity-70 transition-opacity"
            aria-label="Threadsでシェア"
          >
            <FaThreads className="text-color-text-black w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
      <div className="mt-8">
        <div className="text-xl font-bold mb-2">概要・使い方</div>
        <div>{snippet.description}</div>
      </div>
      <div className="mt-8">
        <div className="text-xl font-bold mb-2">コンテンツ</div>
        <ContentBlockDisplay contentBlocks={sortedContentBlocks} />
      </div>
      <div className="flex items-center justify-center mt-10">
      <Link
        href="/snippets/"
        className="text-white bg-color-primary hover:bg-color-primary-hover font-bold rounded-md md:rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 text-center flex gap-2 w-full items-center justify-center md:max-w-60 md:min-w-60"
      >
        一覧へ戻る
      </Link>
      </div>
    </div>
  );
};

export default SnippetDetail;
