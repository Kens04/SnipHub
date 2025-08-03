import { Status } from "./_components/dashboard/Status";
import { SnippetCount } from "./_components/dashboard/SnippetCount";

const Dashboard: React.FC = () => {
  return (
    <>
      <h2 className="text-left text-color-text-black text-2xl md:text-3xl font-bold">
        ダッシュボード
      </h2>
      <Status />
      <div className="mt-10">
        <SnippetCount />
      </div>
    </>
  );
};

export default Dashboard;