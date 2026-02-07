import { RiDeleteBinLine } from "react-icons/ri";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import Link from "next/link";
import { ReactNode } from "react";

interface SnippetFavoriteTableProps {
  error: ReactNode;
  isLoading: boolean;
  handleUnfavoriteClick: (snippetId: number, title: string) => void;
  filteredSnippets: {
    tags: {
      tag: { name: string };
    }[];
    category: {
      name: string;
    };
    name: string;
    description: string;
    id: number;
    isPublic: boolean;
    title: string;
    updatedAt: string;
  }[];
}

const SnippetFavoriteTable: React.FC<SnippetFavoriteTableProps> = ({
  error,
  isLoading,
  handleUnfavoriteClick,
  filteredSnippets,
}) => {
  return (
    <div className="mt-5 overflow-x-auto whitespace-nowrap">
      <table className="w-full">
        <thead className="bg-[#F2F2F2]">
          <tr>
            <th className="border p-2">タイトル</th>
            <th className="border p-2">概要・使い方</th>
            <th className="border p-2">カテゴリ</th>
            <th className="border p-2">更新日</th>
            <th className="border p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={5} className="border p-2 text-center">
                読み込み中...
              </td>
            </tr>
          )}
          {error && (
            <tr>
              <td
                colSpan={5}
                className="border p-2 text-center text-color-danger"
              >
                エラーが発生しました
              </td>
            </tr>
          )}
          {filteredSnippets.length === 0 && !isLoading && !error && (
            <tr>
              <td colSpan={5} className="border p-2 text-center">
                お気に入りのスニペットがありません
              </td>
            </tr>
          )}
          {filteredSnippets.map((snippet) => (
            <tr key={snippet.id}>
              <td className="border p-2">
                {snippet.title.length > 10
                  ? `${snippet.title.slice(0, 10)}...`
                  : snippet.title}
              </td>
              <td className="border p-2">
                {snippet.description.length > 25
                  ? `${snippet.description.slice(0, 25)}...`
                  : snippet.description}
              </td>
              <td className="border p-2">{snippet.category.name}</td>
              <td className="border p-2">
                {new Date(snippet.updatedAt).toLocaleDateString("ja-JP")}
              </td>
              <td className="border p-2">
                <div className="flex gap-1">
                  <Link href={`/dashboard/snippets/${snippet.id}`}>
                    <LuSquareArrowOutUpRight className="text-color-text-black w-4 h-4 md:w-6 md:h-6" />
                  </Link>
                  <button
                    className="cursor-pointer"
                    type="button"
                    onClick={() =>
                      handleUnfavoriteClick(snippet.id, snippet.title)
                    }
                    title="お気に入り解除"
                  >
                    <RiDeleteBinLine className="fill-color-danger w-4 h-4 md:w-6 md:h-6" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SnippetFavoriteTable;
