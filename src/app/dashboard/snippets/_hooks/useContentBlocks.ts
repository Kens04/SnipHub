import { useCallback, useState } from "react";
import { ContentBlock } from "../new/_types/contentBlock";
import { TemplateType } from "../new/_types/template-type";

export const useContentBlocks = (initialBlocks: ContentBlock[] = []) => {
  const [contentBlocks, setContentBlocks] =
    useState<ContentBlock[]>(initialBlocks);

  const updateContentBlock = useCallback(
    (id: number, updates: Partial<ContentBlock>) => {
      setContentBlocks((prev) =>
        prev.map((block) =>
          block.id === id ? { ...block, ...updates } : block
        )
      );
    },
    []
  );

  const handleMarkdownChange = useCallback(
    (id: number, newValue: string) => {
      updateContentBlock(id, { content: newValue });
    },
    [updateContentBlock]
  );

  const handleTextChange = useCallback(
    (id: number, newValue: string) => {
      updateContentBlock(id, { content: newValue });
    },
    [updateContentBlock]
  );

  const handlePreviewChange = useCallback(
    (
      id: number,
      newCode: string,
      template: string,
      files: Record<string, { code: string }>
    ) => {
      updateContentBlock(id, {
        code: newCode,
        template: template as TemplateType,
        files: files,
      });
    },
    [updateContentBlock]
  );

  const addMarkdown = useCallback(() => {
    const contentId = contentBlocks.map((block) => block.id);
    const contentOrder = contentBlocks.map((block) => block.order);
    const maxId = contentBlocks.length === 0 ? 0 : Math.max(...contentId);
    const maxOrder = contentBlocks.length === 0 ? 0 : Math.max(...contentOrder);

    setContentBlocks([
      ...contentBlocks,
      {
        id: maxId + 1,
        type: "markdown",
        content: "",
        order: maxOrder + 1,
      },
    ]);
  }, [contentBlocks]);

  const addPreviewCode = useCallback(() => {
    const contentId = contentBlocks.map((block) => block.id);
    const contentOrder = contentBlocks.map((block) => block.order);
    const maxId = contentBlocks.length === 0 ? 0 : Math.max(...contentId);
    const maxOrder = contentBlocks.length === 0 ? 0 : Math.max(...contentOrder);

    setContentBlocks([
      ...contentBlocks,
      {
        id: maxId + 1,
        type: "preview",
        content: "",
        order: maxOrder + 1,
        code: "",
        template: "react-ts" as TemplateType,
        files: {},
      },
    ]);
  }, [contentBlocks]);

  const addText = useCallback(() => {
    const contentId = contentBlocks.map((block) => block.id);
    const contentOrder = contentBlocks.map((block) => block.order);
    const maxId = contentBlocks.length === 0 ? 0 : Math.max(...contentId);
    const maxOrder = contentBlocks.length === 0 ? 0 : Math.max(...contentOrder);

    setContentBlocks([
      ...contentBlocks,
      {
        id: maxId + 1,
        type: "text",
        content: "",
        order: maxOrder + 1,
      },
    ]);
  }, [contentBlocks]);

  const contentBlockDelete = useCallback((id: number) => {
    setContentBlocks((prev) => prev.filter((block) => block.id !== id));
  }, []);

  const contentBlockOrder = useCallback((order: number) => {
    setContentBlocks((prev) => {
      const i = prev.findIndex((a) => a.order === order);
      const j = prev.findIndex((b) => b.order === order - 1);
      if (j === -1) return prev;

      const next = prev.map((b) => ({ ...b }));
      [next[i].order, next[j].order] = [next[j].order, next[i].order];

      next.sort((a, b) => a.order - b.order);
      return next;
    });
  }, []);

  return {
    contentBlocks,
    setContentBlocks,
    handleMarkdownChange,
    handleTextChange,
    handlePreviewChange,
    addMarkdown,
    addPreviewCode,
    addText,
    contentBlockDelete,
    contentBlockOrder,
  };
};
