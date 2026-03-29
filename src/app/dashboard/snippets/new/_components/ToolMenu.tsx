import { Editor } from "@tiptap/react";
import {
  MdHorizontalRule,
  MdFormatBold,
  MdFormatUnderlined,
  MdFormatStrikethrough,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdCode,
  MdFormatQuote,
  MdLink,
  MdLinkOff,
  MdHighlight,
  MdUndo,
  MdRedo,
} from "react-icons/md";

interface ToolMenuProps {
  editor: Editor;
  disabled: boolean;
}

export const ToolMenu: React.FC<ToolMenuProps> = ({ editor, disabled }) => {
  if (!editor) {
    return null;
  }

  const buttonClass = (isActive = false) =>
    `rounded border px-2 py-1 text-sm transition-colors ${
      isActive
        ? "border-color-primary bg-blue-50 text-color-primary"
        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
    }`;

  const handleSetLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("リンクURLを入力してください", previousUrl);

    if (url === null) {
      return;
    }

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url,
        target: "_blank",
        rel: "noopener noreferrer nofollow",
      })
      .run();
  };

  return (
    <div
      className={`flex flex-wrap gap-2 items-center border-b border-gray-300 p-2 bg-gray-50 ${disabled ? "pointer-events-none opacity-70" : "pointer-events-auto"}`}
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={buttonClass(editor.isActive("paragraph"))}
      >
        P
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
      >
        <MdFormatBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive("underline"))}
      >
        <MdFormatUnderlined />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive("strike"))}
      >
        <MdFormatStrikethrough />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={buttonClass(editor.isActive("highlight"))}
      >
        <MdHighlight />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
      >
        <span className="text-lg font-bold">H1</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
      >
        <span className="text-lg font-bold">H2</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
      >
        <span className="text-lg font-bold">H3</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
      >
        <MdFormatListBulleted />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
      >
        <MdFormatListNumbered />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={buttonClass(editor.isActive("code"))}
      >
        <span className="font-mono text-xs">code</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={buttonClass(editor.isActive("codeBlock"))}
      >
        <MdCode />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive("blockquote"))}
      >
        <MdFormatQuote />
      </button>
      <button
        type="button"
        onClick={handleSetLink}
        className={buttonClass(editor.isActive("link"))}
      >
        <MdLink />
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().extendMarkRange("link").unsetLink().run()
        }
        className={buttonClass(false)}
      >
        <MdLinkOff />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={buttonClass(false)}
      >
        <MdHorizontalRule />
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        type="button"
        className={buttonClass(false)}
      >
        <MdUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        type="button"
        className={buttonClass(false)}
      >
        <MdRedo />
      </button>
    </div>
  );
};
