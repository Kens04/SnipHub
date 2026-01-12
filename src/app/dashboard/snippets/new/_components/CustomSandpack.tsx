"use client";

import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackLayout,
  SandpackFileExplorer,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useEffect, useState, useRef } from "react";
import { getDefaultFiles } from "./getDefaultFiles";
import { ThemeType } from "../_types/themeType";
import { TemplateType } from "../_types/template-type";
import { FiPlus, FiEdit2, FiTrash2, FiFile } from "react-icons/fi";

interface CustomSandpackProps {
  contentCode?: string;
  initialFiles?: Record<string, { code: string }>;
  initialTemplate?: TemplateType;
  onCodeChange?: (
    code: string,
    template: string,
    files: Record<string, { code: string }>
  ) => void;
  disabled: boolean;
}

interface CodeWatcherProps {
  onCodeChange?: (
    code: string,
    template: string,
    files: Record<string, { code: string }>
  ) => void;
  template: string;
}

const CodeWatcher: React.FC<CodeWatcherProps> = ({
  onCodeChange,
  template,
}) => {
  const { sandpack } = useSandpack();
  const isFirstRender = useRef(true);
  const onCodeChangeRef = useRef(onCodeChange);

  useEffect(() => {
    onCodeChangeRef.current = onCodeChange;
  }, [onCodeChange]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (onCodeChangeRef.current) {
      const activeFile = sandpack.activeFile;
      const activeCode = sandpack.files[activeFile]?.code || "";

      const allFiles = Object.entries(sandpack.files).reduce<
        Record<string, { code: string }>
      >((acc, [path, file]) => {
        acc[path] = { code: file.code };
        return acc;
      }, {});

      onCodeChangeRef.current(activeCode, template, allFiles);
    }
  }, [sandpack.files, sandpack.activeFile, template]);

  return null;
};

// ファイル管理コンポーネント
const FileManager: React.FC<{
  template: TemplateType;
  theme: ThemeType;
  disabled: boolean;
  onAddFile: (fileName: string) => void;
  onRenameFile: (oldName: string, newName: string) => void;
  onDeleteFile: (fileName: string) => void;
}> = ({ template, theme, disabled, onAddFile, onRenameFile, onDeleteFile }) => {
  const { sandpack } = useSandpack();
  const [isAddingFile, setIsAddingFile] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>("");

  const isDark = theme === "dark";

  // テンプレートに応じたファイル拡張子
  const getDefaultExtension = () => {
    switch (template) {
      case "react-ts":
        return ".tsx";
      case "react":
        return ".js";
      case "vanilla":
        return ".js";
      case "static":
        return ".html";
      default:
        return ".tsx";
    }
  };

  // 削除不可のファイル
  const protectedFiles = [
    // React系
    "/App.tsx",
    "/App.js",
    "/tsconfig.json",
    // Vanilla/Static系
    "/index.js",
    "/index.html",
    // スタイルファイル
    "/styles.css",
    "/style.css",
    // その他のシステムファイル
    "/index.tsx",
    "/index.jsx",
    "/public/index.html",
  ];

  const handleAddFile = () => {
    if (!newFileName.trim()) return;

    let fileName = newFileName.trim();
    if (!fileName.includes(".")) {
      fileName += getDefaultExtension();
    }
    if (!fileName.startsWith("/")) {
      fileName = "/" + fileName;
    }

    onAddFile(fileName);
    setNewFileName("");
    setIsAddingFile(false);
  };

  const handleRename = (oldName: string) => {
    if (!renameValue.trim() || renameValue === oldName) {
      setRenamingFile(null);
      return;
    }

    let newName = renameValue.trim();
    if (!newName.startsWith("/")) {
      newName = "/" + newName;
    }

    onRenameFile(oldName, newName);
    setRenamingFile(null);
    setRenameValue("");
  };

  const startRename = (fileName: string) => {
    setRenamingFile(fileName);
    setRenameValue(fileName);
  };

  const userFiles = Object.keys(sandpack.files).filter(
    (file) => !file.includes("node_modules") && !file.includes("package.json")
  );

  return (
    <div
      className={`border-b p-2 ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
      } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-sm font-medium ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}
        >
          ファイル管理
        </span>
        <button
          type="button"
          onClick={() => setIsAddingFile(true)}
          disabled={disabled}
          className={`flex items-center gap-1 px-2 py-1 text-xs bg-color-primary text-white rounded transition-colors ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-color-primary-hover"
          }`}
        >
          <FiPlus size={12} />
          新規ファイル
        </button>
      </div>

      {/* 新規ファイル入力 */}
      {isAddingFile && (
        <div className="flex flex-wrap gap-2 mb-2">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder={`ファイル名${getDefaultExtension()}`}
            disabled={disabled}
            className={`flex-1 min-w-[150px] px-2 py-1 text-sm border rounded ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddFile();
              if (e.key === "Escape") setIsAddingFile(false);
            }}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddFile}
              disabled={disabled}
              className={`px-3 py-1 text-xs w-full font-bold text-center bg-blue-500 text-white rounded whitespace-nowrap ${
                disabled ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
              }`}
            >
              追加
            </button>
            <button
              type="button"
              onClick={() => setIsAddingFile(false)}
              disabled={disabled}
              className={`px-3 py-1 text-xs rounded whitespace-nowrap ${
                isDark
                  ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* ファイルリスト */}
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {userFiles.map((fileName) => {
          const isProtected = protectedFiles.includes(fileName);
          const isRenaming = renamingFile === fileName;

          return (
            <div
              key={fileName}
              className={`flex items-center justify-between px-2 py-1 rounded border text-sm ${
                isDark
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              }`}
            >
              {isRenaming ? (
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  disabled={disabled}
                  className={`flex-1 px-1 py-0.5 text-sm border rounded mr-2 ${
                    isDark
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(fileName);
                    if (e.key === "Escape") setRenamingFile(null);
                  }}
                  onBlur={() => handleRename(fileName)}
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-1 flex-1 truncate">
                  <FiFile
                    size={12}
                    className={isDark ? "text-gray-400" : "text-gray-400"}
                  />
                  <span
                    className={`truncate ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {fileName}
                  </span>
                  {isProtected && (
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      (メイン)
                    </span>
                  )}
                </div>
              )}

              {!isRenaming && !isProtected && (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => startRename(fileName)}
                    disabled={disabled}
                    className={`p-1 transition-colors ${
                      isDark
                        ? "text-gray-400 hover:text-blue-400"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                    title="名前変更"
                  >
                    <FiEdit2 size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteFile(fileName)}
                    disabled={disabled}
                    className={`p-1 transition-colors ${
                      isDark
                        ? "text-gray-400 hover:text-red-400"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                    title="削除"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ファイル操作をSandpackに反映するコンポーネント
const FileOperations: React.FC<{
  template: TemplateType;
  theme: ThemeType;
  disabled: boolean;
  onFilesChange: (files: Record<string, { code: string }>) => void;
}> = ({ template, theme, disabled, onFilesChange }) => {
  const { sandpack } = useSandpack();

  const handleAddFile = (fileName: string) => {
    let defaultCode = "";
    if (fileName.endsWith(".tsx") || fileName.endsWith(".jsx")) {
      const componentName = fileName
        .replace(/^\//, "")
        .replace(/\.(tsx|jsx)$/, "");
      defaultCode = `export default function ${componentName}() {\n  return <div>${componentName}</div>;\n}`;
    } else if (fileName.endsWith(".ts") || fileName.endsWith(".js")) {
      defaultCode = `// ${fileName}\n`;
    } else if (fileName.endsWith(".css")) {
      defaultCode = `/* ${fileName} */\n`;
    } else if (fileName.endsWith(".html")) {
      defaultCode = `<!DOCTYPE html>\n<html>\n  <head>\n    <title>New Page</title>\n  </head>\n  <body>\n    <h1>Hello world</h1>\n  </body>\n</html>`;
    }

    sandpack.addFile(fileName, defaultCode);
    sandpack.setActiveFile(fileName);

    const allFiles = { ...sandpack.files, [fileName]: { code: defaultCode } };
    const formattedFiles = Object.entries(allFiles).reduce<
      Record<string, { code: string }>
    >((acc, [path, file]) => {
      acc[path] = { code: typeof file === "string" ? file : file.code };
      return acc;
    }, {});
    onFilesChange(formattedFiles);
  };

  const handleRenameFile = (oldName: string, newName: string) => {
    const fileContent = sandpack.files[oldName]?.code || "";
    sandpack.deleteFile(oldName);
    sandpack.addFile(newName, fileContent);
    sandpack.setActiveFile(newName);

    const allFiles = Object.entries(sandpack.files).reduce<
      Record<string, { code: string }>
    >((acc, [path, file]) => {
      if (path !== oldName) {
        acc[path] = { code: file.code };
      }
      return acc;
    }, {});
    allFiles[newName] = { code: fileContent };
    onFilesChange(allFiles);
  };

  const handleDeleteFile = (fileName: string) => {
    if (confirm(`"${fileName}" を削除しますか？`)) {
      sandpack.deleteFile(fileName);

      const allFiles = Object.entries(sandpack.files).reduce<
        Record<string, { code: string }>
      >((acc, [path, file]) => {
        if (path !== fileName) {
          acc[path] = { code: file.code };
        }
        return acc;
      }, {});
      onFilesChange(allFiles);
    }
  };

  return (
    <FileManager
      template={template}
      theme={theme}
      disabled={disabled}
      onAddFile={handleAddFile}
      onRenameFile={handleRenameFile}
      onDeleteFile={handleDeleteFile}
    />
  );
};

const CustomSandpack: React.FC<CustomSandpackProps> = ({
  contentCode,
  initialFiles,
  initialTemplate = "react-ts",
  onCodeChange,
  disabled = false,
}) => {
  const [template, setTemplate] = useState<TemplateType>(initialTemplate);
  const [theme, setTheme] = useState<ThemeType>("light");
  const [files, setFiles] = useState(
    !initialFiles
      ? getDefaultFiles({ template: initialTemplate, contentCode })
      : initialFiles
  );

  const isDark = theme === "dark";

  const templateFiles = () => {
    switch (template) {
      case "react-ts":
        return {
          visibleFiles: ["/App.tsx", "/Button.tsx"],
          activeFile: "/Button.tsx",
        };
      case "react":
        return {
          visibleFiles: ["/App.js", "/Button.js"],
          activeFile: "/Button.js",
        };
      case "vanilla":
        return {
          visibleFiles: ["/index.js"],
          activeFile: "/index.js",
        };
      case "static":
        return {
          visibleFiles: ["/index.html"],
          activeFile: "/index.html",
        };
      default:
        return {
          visibleFiles: ["/App.tsx", "/Button.tsx"],
          activeFile: "/Button.tsx",
        };
    }
  };

  const handleTemplateChange = (newTemplate: string) => {
    if (disabled) return;
    const validTemplate = newTemplate as TemplateType;
    setTemplate(validTemplate);

    const newFiles = getDefaultFiles({
      template: validTemplate,
      contentCode: undefined,
    });
    setFiles(newFiles);
  };

  const handleThemeChange = (newTheme: string) => {
    if (disabled) return;
    setTheme(newTheme as ThemeType);
  };

  const handleFilesChange = (newFiles: Record<string, { code: string }>) => {
    setFiles(newFiles);
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <div
        className={`p-2 flex gap-2 border-b ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
        }`}
      >
        <select
          onChange={(e) => handleTemplateChange(e.target.value)}
          value={template}
          disabled={disabled}
          className={`px-3 py-1 border rounded ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } ${disabled ? "cursor-not-allowed" : ""}`}
        >
          <option value="react-ts">React + TypeScript</option>
          <option value="react">React</option>
          <option value="vanilla">JavaScript</option>
          <option value="static">HTML</option>
        </select>

        <select
          onChange={(e) => handleThemeChange(e.target.value)}
          value={theme}
          disabled={disabled}
          className={`px-3 py-1 border rounded ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } ${disabled ? "cursor-not-allowed" : ""}`}
        >
          <option value="light">ライトモード</option>
          <option value="dark">ダークモード</option>
        </select>
      </div>

      <SandpackProvider
        key={template}
        files={files}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          ...templateFiles(),
        }}
        template={template}
        theme={theme}
      >
        <FileOperations
          template={template}
          theme={theme}
          disabled={disabled}
          onFilesChange={handleFilesChange}
        />
        <SandpackLayout>
          <SandpackFileExplorer
            className={disabled ? "pointer-events-none" : ""}
          />
          <SandpackCodeEditor
            showTabs
            showLineNumbers={false}
            showInlineErrors
            wrapContent
            closableTabs
            readOnly={disabled}
          />
          <SandpackPreview className="!h-auto" />
        </SandpackLayout>
        {onCodeChange && !disabled && (
          <CodeWatcher onCodeChange={onCodeChange} template={template} />
        )}
      </SandpackProvider>
    </div>
  );
};

export default CustomSandpack;
