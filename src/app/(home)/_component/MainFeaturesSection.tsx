import icon4 from "../../public/images/icon4.png";
import icon5 from "../../public/images/icon5.png";
import icon6 from "../../public/images/icon6.png";
import { MainFeaturesCard } from "./MainFeaturesCard";
import { Title } from "../_component/Title";

export const MainFeaturesSection: React.FC = () => {
  return (
    <div className="mt-14 md:mt-24">
      <Title title="主な機能" />
      <p className="text-center mt-5 text-color-text-gray">
        SnipHubは、あなたの開発作業を効率化する機能を提供します。
      </p>
      <ul className="flex-col md:flex-row flex gap-5 mt-10">
        <MainFeaturesCard
          icon={icon4}
          width={30}
          height={30}
          alt="書くだけ即プレビュー"
          title="書くだけ即プレビュー"
          text="書いたコードをその場でリアルタイムにプレビューできます。"
        />

        <MainFeaturesCard
          icon={icon5}
          width={30}
          height={30}
          alt="タグ・カテゴリー管理"
          title="タグ・カテゴリー管理"
          text="自由にタグ付けして、あらゆるスニペットを管理できます。"
        />

        <MainFeaturesCard
          icon={icon6}
          width={30}
          height={30}
          alt="公開用/プライベート用を切り替え"
          title="公開用/プライベート用を切り替え"
          text="公開用・プライベート用の切り替えで使い分け可能。"
        />
      </ul>
    </div>
  );
};
