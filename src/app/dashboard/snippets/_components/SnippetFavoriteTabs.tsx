import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { SnippetTabProps } from "../_type/snippetFilters";

const SnippetFavoriteTabs: React.FC<SnippetTabProps> = ({ children }) => {
  return (
    <>
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h2 className="text-left text-color-text-black text-3xl font-bold">
          {children}
        </h2>
        <div>
          <Link
            href="/dashboard/snippets/new"
            className="text-white bg-color-primary hover:bg-color-primary-hover font-bold rounded-md md:rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 text-center flex gap-2 items-center"
          >
            <FiPlus className="w-5 h-5" />
            新規スニペット作成
          </Link>
        </div>
      </div>
    </>
  );
};

export default SnippetFavoriteTabs;
