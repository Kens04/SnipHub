interface SnippetCountCardProps {
  number: string;
  text: string;
}

export const SnippetCountCard: React.FC<SnippetCountCardProps> = ({
  number,
  text,
}) => {
  return (
    <div className="bg-color-secondary py-5 px-4 rounded-lg w-full lg:w-1/3">
      <div className="text-center">
        <span className="font-bold text-xl">{number}</span>
      </div>
      <h3 className="text-center">{text}</h3>
    </div>
  );
};