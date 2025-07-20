import Image, { StaticImageData } from "next/image";

interface ProblemSolvingCardProps {
  icon: StaticImageData;
  width: number;
  height: number;
  alt: string;
  title: string;
  text: string;
}

export const ProblemSolvingCard: React.FC<ProblemSolvingCardProps> = ({
  icon,
  width,
  height,
  alt,
  title,
  text,
}) => {
  return (
    <>
      <li className="bg-color-white p-5 w-full md:w-2/6 rounded-2xl">
        <Image src={icon} width={width} height={height} alt={alt} />
        <h3 className="mt-2 font-semibold text-lg">{title}</h3>
        <div className="border border-color-accent w-16 mt-4" />
        <p className="mt-4 text-color-text-gray">{text}</p>
      </li>
    </>
  );
};
