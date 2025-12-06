import { FiPlus } from "react-icons/fi";

interface AddContentBlockButtonsProps {
  addMarkdown: () => void;
  addText: () => void;
  addPreviewCode: () => void;
  disabled: boolean;
}

export const AddContentBlockButtons: React.FC<AddContentBlockButtonsProps> = ({
  addMarkdown,
  addText,
  addPreviewCode,
  disabled,
}) => {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      <button
        className="bg-color-white py-2 px-4 border rounded-md flex items-center gap-2"
        type="button"
        onClick={addMarkdown}
        disabled={disabled}
      >
        <FiPlus className="font-bold" />
        <span>Markdownブロック</span>
      </button>

      <button
        className="bg-color-white py-2 px-4 border rounded-md flex items-center gap-2"
        type="button"
        onClick={addText}
        disabled={disabled}
      >
        <FiPlus className="font-bold" />
        <span>説明文ブロック</span>
      </button>

      <button
        className="bg-color-white py-2 px-4 border rounded-md flex items-center gap-2"
        type="button"
        onClick={addPreviewCode}
        disabled={disabled}
      >
        <FiPlus className="font-bold" />
        <span>Live Previewブロック</span>
      </button>
    </div>
  );
};
