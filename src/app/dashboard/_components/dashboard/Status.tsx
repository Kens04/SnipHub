import { StatusCard } from "./StatusCard";

export const Status: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-10">
      <StatusCard
        title="総スニペット数"
        number="10"
        text={<p className="mt-1">公開: 28 / プライベート: 14</p>}
      />
      <StatusCard title="獲得ポイント" number="10pt" />
      <StatusCard title="アクティブランキング" number="10位" />
    </div>
  );
};