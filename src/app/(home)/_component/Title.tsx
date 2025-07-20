interface TitleProps {
  title: string;
}

export const Title: React.FC<TitleProps> = ({ title }) => {
  return <h2 className="text-center text-xl md:text-2xl font-bold">{title}</h2>;
};
