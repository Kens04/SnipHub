import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ReactNode } from "react";

interface PublicButtonProps {
  isSubmitting: boolean;
  isSubmittingText?: string;
  children: ReactNode;
  className?: string;
  onClick: () => void;
}

const PublicButton: React.FC<PublicButtonProps> = ({
  isSubmitting,
  children,
  isSubmittingText = "送信中...",
  className = "",
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isSubmitting}
      className={`w-full font-bold rounded-lg text-sm px-5 py-2.5 text-center ${
        isSubmitting
          ? "bg-gray-300 text-text-black pointer-events-none"
          : className
      }`}
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

export default PublicButton;
