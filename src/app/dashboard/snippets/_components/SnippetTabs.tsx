import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { SnippetTabProps } from "../_type/snippetFilters";

const SnippetTabs: React.FC<SnippetTabProps> = ({ snippetType }) => {
  return (
    <>
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h2 className="text-left text-color-text-black text-3xl font-bold">
          スニペット一覧
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
      <div className="flex gap-4 border-b-2 border-color-text-gray-light mt-10">
        <Link
          className={
            snippetType === "all"
              ? "text-color-primary hover:text-color-primary-hover relative top-[2px] text-base md:text-xl md:leading-loose font-semibold border-b-2 border-color-primary"
              : "font-semibold text-base md:text-xl relative top-[2px] md:leading-loose"
          }
          href="/dashboard/snippets"
        >
          すべて
        </Link>
        <Link
          className={
            snippetType === "public"
              ? "text-color-primary hover:text-color-primary-hover relative top-[2px] text-base md:text-xl md:leading-loose font-semibold border-b-2 border-color-primary"
              : "font-semibold text-base md:text-xl relative top-[2px] md:leading-loose"
          }
          href="/dashboard/snippets/public"
        >
          公開用
        </Link>
        <Link
          className={
            snippetType === "private"
              ? "text-color-primary hover:text-color-primary-hover relative top-[2px] text-base md:text-xl md:leading-loose font-semibold border-b-2 border-color-primary"
              : "font-semibold text-base md:text-xl relative top-[2px] md:leading-loose"
          }
          href="/dashboard/snippets/private"
        >
          プライベート用
        </Link>
      </div>
    </>
  );
};

export default SnippetTabs;
