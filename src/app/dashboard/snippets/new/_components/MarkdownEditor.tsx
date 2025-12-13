import Editor from "@monaco-editor/react";

interface MarkdownEditorProps {
  onChange: (value: string) => void;
  value: string;
  disabled: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  disabled,
}) => {
  return (
    <Editor
      height="50vh"
      defaultLanguage="markdown"
      value={value}
      onChange={(value) => value && onChange(value)}
      theme="vs-dark"
      options={{
        fontSize: 16,
        tabSize: 2,
        readOnly: disabled,
      }}
    />
  );
};
