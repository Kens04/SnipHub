import { ReactNode } from "react";

interface StatusCardProps {
  title: string;
  number: string | number;
  text?: ReactNode;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  number,
  text,
}) => {
  return (
    <div className="bg-color-white p-4 rounded-lg w-full lg:w-1/3 shadow-md">
      <h3>{title}</h3>
      <div>
        <span className="font-bold text-xl">{number}</span>
      </div>
      {text}
    </div>
  );
};