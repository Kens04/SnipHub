"use client";

import { useAuthDataFetch } from "@/app/_hooks/useAuthDataFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { SnippetData } from "@/app/_types/snippet";
import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import toast from "react-hot-toast";
import { ContentBlockDisplay } from "./_components/ContentBlockDisplay";

const SnippetDetail = ({ params }: { params: { id: string } }) => {
  const { token, user } = useSupabaseSession();
  const { data, isLoading, mutate } = useAuthDataFetch<SnippetData>(
    user ? `/api/snippet/${params.id}` : null,
    token
  );

  const handleToggleVisibility = async (
    snippetId: number,
    title: string,
    isVisible: boolean
  ) => {
    try {
      toast.loading(
        `「${title}」のスニペットを${!isVisible ? "公開" : "非公開"}中です・・・`
      );

      const res = await fetch(`/api/snippet/${snippetId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isPublic: !isVisible,
        }),
      });

      toast.remove();

      if (res.ok) {
        toast.success(
          `「${title}」のスニペットを${!isVisible ? "公開" : "非公開"}にしました`
        );
        mutate();
      } else {
        toast.error(
          `「${title}」のスニペットを${!isVisible ? "公開" : "非公開"}に失敗しました`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavorite = async (snippetId: number, isFavorited: boolean) => {
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
  const isFavorited = snippet.favorites.some(
    (favorite) => favorite.userId === snippet.user.id
  );

  const isLiked = snippet.likes.some((like) => like.userId === snippet.user.id);

  // contentBlocksをorder順にソート
  const sortedContentBlocks = [...snippet.contentBlocks]
    .sort((a, b) => a.order - b.order)
    .map((block) => ({
      ...block,
      content: block.content || "",
    }));

  return (
    <div>
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
            onClick={() =>
              handleFavorite(
                snippet.id,
                snippet.favorites.some(
                  (favorite) => favorite.userId === snippet.user.id
                )
              )
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
            onClick={() =>
              handleLike(
                snippet.id,
                snippet.likes.some((like) => like.userId === snippet.user.id)
              )
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
        <div className="flex items-center">
          {snippet.isPublic ? (
            <button
              className="cursor-pointer"
              type="button"
              onClick={() =>
                handleToggleVisibility(
                  snippet.id,
                  snippet.title,
                  snippet.isPublic
                )
              }
            >
              <div className="flex items-center gap-2">
                <LuEye className="text-color-text-black w-4 h-4 md:w-6 md:h-6" />
                <span>公開中</span>
              </div>
            </button>
          ) : (
            <button
              className="cursor-pointer"
              type="button"
              onClick={() =>
                handleToggleVisibility(
                  snippet.id,
                  snippet.title,
                  snippet.isPublic
                )
              }
            >
              <div className="flex items-center gap-2">
                <LuEyeClosed className="text-color-text-black w-4 h-4 md:w-6 md:h-6" />
                <span className="text-sm">非公開中</span>
              </div>
            </button>
          )}
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
    </div>
  );
};

export default SnippetDetail;
