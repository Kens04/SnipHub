import Editor from "@monaco-editor/react";

interface MarkdownEditorProps {
  onChange: (value: string) => void;
  value: string;
  disabled: boolean;
  fitContent?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  disabled,
  fitContent = false,
}) => {
  const lineCount = Math.max(value.split("\n").length, 1);
  const contentHeight = Math.min(Math.max(lineCount * 24 + 24, 96), 640);
  const isDisplayOnly = disabled && fitContent;

  return (
    <Editor
      height={fitContent ? contentHeight : "50vh"}
      defaultLanguage="markdown"
      value={value}
      onChange={(value) => value && onChange(value)}
      theme="vs-dark"
      options={{
        automaticLayout: true,
        fontSize: 16,
        tabSize: 2,
        readOnly: disabled,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        scrollbar: {
          alwaysConsumeMouseWheel: !isDisplayOnly,
          vertical: isDisplayOnly ? "hidden" : "auto",
        },
      }}
    />
  );
};
