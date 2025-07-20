import Image, { StaticImageData } from "next/image";

interface MainFeaturesCardProps {
  icon: StaticImageData;
  width: number;
  height: number;
  alt: string;
  title: string;
  text: string;
}

export const MainFeaturesCard: React.FC<MainFeaturesCardProps> = ({
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
        <div>
          <Image
            className="m-auto"
            src={icon}
            width={width}
            height={height}
            alt={alt}
          />
        </div>
        <h3 className="mt-2 font-semibold text-lg text-center">{title}</h3>

        <p className="mt-4 text-color-text-gray">{text}</p>
      </li>
    </>
  );
};
