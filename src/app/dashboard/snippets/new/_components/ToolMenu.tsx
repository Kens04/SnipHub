import { Editor } from "@tiptap/react";
import {
  MdFormatBold,
  MdFormatStrikethrough,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdCode,
  MdFormatQuote,
  MdUndo,
  MdRedo,
} from "react-icons/md";

interface ToolMenuProps {
  editor: Editor;
  isActiveBold: boolean;
  disabled: boolean;
}

export const ToolMenu: React.FC<ToolMenuProps> = ({
  editor,
  isActiveBold,
  disabled,
}) => {
  if (!editor) {
    return null;
  }

  return (
    <div
      className={`flex flex-wrap gap-2 items-end border-b border-gray-300 p-2 bg-gray-50 text-2xl ${disabled ? "pointer-events-none" : "pointer-events-auto"}`}
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={!isActiveBold ? "opacity-20" : ""}
      >
        <MdFormatBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={!editor.isActive("strike") ? "opacity-20" : ""}
      >
        <MdFormatStrikethrough />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          !editor.isActive("heading", { level: 1 }) ? "opacity-20" : ""
        }
      >
        <span className="text-lg font-bold">H1</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          !editor.isActive("heading", { level: 2 }) ? "opacity-20" : ""
        }
      >
        <span className="text-lg font-bold">H2</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          !editor.isActive("heading", { level: 3 }) ? "opacity-20" : ""
        }
      >
        <span className="text-lg font-bold">H3</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={!editor.isActive("bulletList") ? "opacity-20" : ""}
      >
        <MdFormatListBulleted />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={!editor.isActive("orderedList") ? "opacity-20" : ""}
      >
        <MdFormatListNumbered />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={!editor.isActive("codeBlock") ? "opacity-20" : ""}
      >
        <MdCode />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={!editor.isActive("blockquote") ? "opacity-20" : ""}
      >
        <MdFormatQuote />
      </button>
      <button onClick={() => editor.chain().focus().undo().run()} type="button">
        <MdUndo />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} type="button">
        <MdRedo />
      </button>
    </div>
  );
};
