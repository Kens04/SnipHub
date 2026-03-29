import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { ToolMenu } from "./ToolMenu";
import { useEffect } from "react";

interface TiptapEditorProps {
  sentence: string;
  setSentence: (sentence: string) => void;
  disabled: boolean;
}

export const TiptapEditor:React.FC<TiptapEditorProps> = ({
  sentence,
  setSentence,
  disabled,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Highlight,
      HorizontalRule,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Placeholder.configure({
        placeholder:
          "見出し、本文、コード例、引用を組み合わせてわかりやすく整理できます。",
      }),
    ],
    content: sentence,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-base max-w-none min-h-[320px] p-5 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();
    if (sentence !== currentHtml) {
      editor.commands.setContent(sentence || "<p></p>");
    }
  }, [editor, sentence]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleUpdate = () => {
      const nextHtml = editor.getHTML();
      setSentence(nextHtml);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, setSentence]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full mx-auto border border-gray-300 shadow-sm bg-white">
      <ToolMenu disabled={disabled} editor={editor} />
      <div className="overflow-y-auto max-h-[70vh] bg-white">
        <EditorContent
          editor={editor}
          className={disabled ? "pointer-events-none" : "pointer-events-auto"}
        />
      </div>
    </div>
  );
}
