import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { LuEye, LuEyeClosed, LuSquareArrowOutUpRight } from "react-icons/lu";
import Link from "next/link";
import { SnippetTableProps } from "../_type/snippetFilters";

const SnippetTable: React.FC<SnippetTableProps> = ({
  error,
  isLoading,
  handleDeleteClick,
  handleToggleVisibility,
  filteredSnippets,
  snippetType,
}: SnippetTableProps) => {

  let displaySnippets = filteredSnippets;

  if (snippetType === "public") {
    displaySnippets = filteredSnippets.filter(
      (snippet) => snippet.isPublic === true
    );
  } else if (snippetType === "private") {
    displaySnippets = filteredSnippets.filter(
      (snippet) => snippet.isPublic === false
    );
  }

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
          {displaySnippets.length === 0 && !isLoading && !error && (
            <tr>
              <td colSpan={5} className="border p-2 text-center">
                スニペットがありません
              </td>
            </tr>
          )}
          {displaySnippets.map((snippet) => (
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
                    <LuSquareArrowOutUpRight className="text-color-text-black w-4 h-4 md:w-6 md:h-6 mr-1" />
                  </Link>
                  <Link href={`/dashboard/snippets/${snippet.id}/edit`}>
                    <FaRegEdit className="text-color-text-black w-4 h-4 md:w-6 md:h-6" />
                  </Link>
                  <button
                    className="cursor-pointer"
                    type="button"
                    onClick={() => handleDeleteClick(snippet.id, snippet.title)}
                  >
                    <RiDeleteBinLine className="fill-color-danger text-color-text-black w-4 h-4 md:w-6 md:h-6" />
                  </button>
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
                      <LuEye className="text-color-text-black w-4 h-4 md:w-6 md:h-6" />
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
                      <LuEyeClosed className="text-color-text-black w-4 h-4 md:w-6 md:h-6" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SnippetTable;
