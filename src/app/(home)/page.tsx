import { Main } from "./_component/Main";
import { MainFeaturesSection } from "./_component/MainFeaturesSection";
import { ProblemSolvingSection } from "./_component/ProblemSolvingSection";

export default function Home() {
  return (
    <div className="mt-[88px] md:mt-[158px] mb-[80px] md:mb-[100px] px-4 md:px-8 md:max-w-7xl m-auto">
      <Main />
      <ProblemSolvingSection />
      <MainFeaturesSection />
    </div>
  );
}
