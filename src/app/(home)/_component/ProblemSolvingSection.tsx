import icon1 from "../../public/images/icon1.png";
import icon2 from "../../public/images/icon2.png";
import icon3 from "../../public/images/icon3.png";
import { ProblemSolvingCard } from "./ProblemSolvingCard";

export const ProblemSolvingSection: React.FC = () => {
  return (
    <div className="mt-14 md:mt-24">
      <h2 className="text-center text-xl md:text-2xl font-bold">
        フロントエンド開発の
        <br className="block sm:hidden" />
        お悩みを解決
      </h2>
      <div>
        <ul className="flex-col md:flex-row flex gap-5 mt-10">
          <ProblemSolvingCard
            icon={icon1}
            width={40}
            height={40}
            alt="コンポーネントを何度もゼロから実装"
            title="コンポーネントを何度もゼロから実装"
            text="一度作成したUIコンポーネントをスニペットライブラリとして保存・再利用できます。"
          />

          <ProblemSolvingCard
            icon={icon2}
            width={40}
            height={40}
            alt="過去の便利なコードを探す手間"
            title="過去の便利なコードを探す手間"
            text="タグ＆カテゴリで絞り込み、欲しいコードを即検索・挿入。"
          />

          <ProblemSolvingCard
            icon={icon3}
            width={40}
            height={40}
            alt="新しいアイデアを発見"
            title="新しいアイデアを発見"
            text="公開されたスニペットを見て、思わぬ実装例やテクニックを学べるかもしれません。"
          />
        </ul>
      </div>
    </div>
  );
};
