import Link from "next/link";
import avatar from "../../public/images/avatar.png";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

interface SnippetCardProps {
  id: string;
  userName: string;
  iconUrl?: string;
  title: string;
  description: string;
  isLiked: boolean;
  likeCount: number;
  category: string;
  tag: string;
}

const SnippetCard: React.FC<SnippetCardProps> = ({
  id,
  iconUrl,
  userName,
  title,
  description,
  isLiked,
  likeCount,
  category,
  tag,
}) => {
  return (
    <Link
      href={`/snippets/${id}`}
      className="block bg-color-white rounded-lg border border-color-border p-4 flex flex-col gap-3 hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-color-primary"
    >
      {/* ユーザー情報 */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          {iconUrl ? (
            <Image
              className="rounded-full"
              src={iconUrl || avatar}
              width={32}
              height={32}
              alt="avatar"
            />
          ) : (
            <>
              <Image
                className="rounded-full"
                src={avatar}
                width={32}
                height={32}
                alt="avatar"
              />
            </>
          )}
        </div>
        <span className="text-sm text-color-text-gray-dark">{userName}</span>
      </div>

      {/* タイトル */}
      <h3 className="font-bold text-lg text-color-text-black">{title}</h3>

      {/* 説明文 */}
      <p className="text-sm text-color-text-gray-dark line-clamp-2">
        {description}
      </p>

      {/* いいね & カテゴリ */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            {isLiked ? (
              <div className="flex items-center gap-1">
                <FaHeart className="text-color-danger w-4 h-4 md:w-6 md:h-6" />
                <span className="text-sm text-color-text-gray-dark">
                  {likeCount}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <FaRegHeart className="text-color-danger w-4 h-4 md:w-6 md:h-6" />
                <span className="text-sm text-color-text-gray-dark">
                  {likeCount}
                </span>
              </div>
            )}
          </div>
        </div>
        <span className="text-xs text-color-white bg-color-category px-3 py-1 rounded-full">
          {category}
        </span>
      </div>

      {/* タグ */}
      <div>
        <span className="text-xs text-color-white bg-color-tag px-3 py-1 rounded-full">
          #{tag}
        </span>
      </div>
    </Link>
  );
};

export default SnippetCard;
