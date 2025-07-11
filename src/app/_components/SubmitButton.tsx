import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ReactNode } from "react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isSubmittingText?: string;
  children: ReactNode;
}

const SubmitButton = ({
  isSubmitting,
  children,
  isSubmittingText,
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className={`${
        isSubmitting
          ? "bg-gray-300 text-black pointer-events-none"
          : "bg-color-primary hover:bg-color-primary-hover text-white"
      } w-full font-bold rounded-lg text-sm px-5 py-2.5 text-center`}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <span className="flex justify-center items-center">
          <span className="mr-2">{isSubmittingText}</span>
          <AiOutlineLoading3Quarters className="animate-spin w-4 h-4" />
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;
