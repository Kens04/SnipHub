import { SnippetCountCard } from "./SnippetCountCard";

export const SnippetCount: React.FC = () => {
  return (
    <div className="bg-color-white rounded-lg shadow-md p-5">
      <h2 className="text-xl md:text-2xl font-bold">マイスニペット</h2>
      <div className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-10">
        <SnippetCountCard number="10" text="公開用" />
        <SnippetCountCard number="5" text="プライベート用" />
        <SnippetCountCard number="10" text="お気に入り" />
      </div>
    </div>
  );
};