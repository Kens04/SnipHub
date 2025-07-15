import { ReactNode } from "react";

interface LabelProps {
  htmlFor: string;
  children: ReactNode;
}

export const Label = ({ htmlFor, children }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-2 text-sm font-medium text-gray-900"
    >
      {children}
      <span className="text-color-danger inline-block ml-1">※</span>
    </label>
  );
};
