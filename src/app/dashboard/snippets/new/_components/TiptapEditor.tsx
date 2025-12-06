"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ToolMenu } from "./ToolMenu";
import { useState } from "react";

interface TiptapEditorProps {
  sentence: string;
  setSentence: (sentence: string) => void;
  disabled: boolean;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  sentence,
  setSentence,
  disabled,
}) => {
  const [isActiveBold, setIsActiveBold] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    content: sentence,
    onTransaction: ({ editor }) => {
      setIsActiveBold(editor.isActive("bold"));
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-base m-5 focus:outline-none",
      },
    },
  });

  if (editor) {
    editor.on("update", () => {
      setSentence(editor.getHTML());
    });
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full mx-auto border border-gray-300 shadow-sm bg-white">
      <ToolMenu
        disabled={disabled}
        editor={editor}
        isActiveBold={isActiveBold}
      />
      <div className="overflow-y-auto max-h-[70vh] bg-white">
        <EditorContent
          editor={editor}
          className={disabled ? "pointer-events-none" : "pointer-events-auto"}
        />
      </div>
    </div>
  );
};
