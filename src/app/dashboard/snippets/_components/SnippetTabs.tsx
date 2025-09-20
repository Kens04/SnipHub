import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { SnippetTabProps } from "../_type/snippetFilters";
import LinkMenu from "./LinkMenu";

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
        <LinkMenu
          snippetType={snippetType}
          targetType="all"
          href="/dashboard/snippets"
        >
          すべて
        </LinkMenu>
        <LinkMenu
          snippetType={snippetType}
          targetType="public"
          href="/dashboard/snippets/public"
        >
          公開用
        </LinkMenu>
        <LinkMenu
          snippetType={snippetType}
          targetType="private"
          href="/dashboard/snippets/private"
        >
          プライベート用
        </LinkMenu>
      </div>
    </>
  );
};

export default SnippetTabs;
