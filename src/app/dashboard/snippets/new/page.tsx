"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Input } from "@/app/_components/Input";
import { Label } from "@/app/_components/Label";
import { CreateSnippetSchema } from "./_lib/CreateSnippetSchema";
import { createSnippetType } from "./_types/createSnippet";
import Select from "react-select";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useState } from "react";
import CustomSandpack from "./_components/CustomSandpack";
import { MarkdownEditor } from "./_components/MarkdownEditor";
import { TiptapEditor } from "./_components/TiptapEditor";
import { useAllCategoriesAndTags } from "../_hooks/useAllCategoriesAndTags";
import PublicButton from "./_components/PublicButton";
import { TemplateType } from "./_types/template-type";
import { ContentBlock } from "./_types/contentBlock";
import { Category } from "./_types/category";
import { Tag } from "./_types/tag";
import { ContentBlockActions } from "./_components/ContentBlockActions";
import { AddContentBlockButtons } from "./_components/AddContentBlockButtons";

const CreateSnippet: React.FC = () => {
  const { token } = useSupabaseSession();
  const { categoryOptions, tagOptions } = useAllCategoriesAndTags(token);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<createSnippetType>({
    resolver: zodResolver(CreateSnippetSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tag: "",
    },
  });

  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  // カテゴリ変更ハンドラー
  const handleCategoryChange = (category: Category | null) => {
    setSelectedCategory(category);
    setValue("category", category?.value || "");
  };

  // タグ変更ハンドラー
  const handleTagsChange = (tags: readonly Tag[]) => {
    const tagsArray = tags ? [...tags] : [];
    setSelectedTags(tagsArray);
    const tagValues = tagsArray.map((t) => t.value).join(",");
    setValue("tag", tagValues);
  };

  // コンテンツブロックの更新ロジックを関数化
  const updateContentBlock = (id: number, updates: Partial<ContentBlock>) => {
    setContentBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, ...updates } : block))
    );
  };

  // Markdown用の更新ハンドラー
  const handleMarkdownChange = (id: number, newValue: string) => {
    updateContentBlock(id, { content: newValue });
  };

  // Text用の更新ハンドラー
  const handleTextChange = (id: number, newValue: string) => {
    updateContentBlock(id, { content: newValue });
  };

  // Preview用の更新ハンドラー
  const handlePreviewChange = (
    id: number,
    newCode: string,
    template: string,
    files: Record<string, { code: string }>
  ) => {
    updateContentBlock(id, {
      code: newCode,
      content: newCode,
      template: template as TemplateType,
      files: files,
    });
  };

  const onSubmit = async (data: createSnippetType, isPublic: boolean) => {
    try {
      if (contentBlocks.length === 0) {
        toast.error("コンテンツブロックを少なくとも1つ追加してください");
        return;
      }

      const categoryId = parseInt(selectedCategory?.value || "0");
      const tagIds = selectedTags.map((t) => parseInt(t.value));

      const sortedContentBlocks = [...contentBlocks].sort(
        (a, b) => a.order - b.order
      );

      const res = await fetch("/api/snippet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          contentBlocks: sortedContentBlocks,
          isPublic: isPublic,
          categoryId: categoryId,
          tagIds: tagIds,
        }),
      });

      if (res.ok) {
        toast.success(
          isPublic
            ? "スニペットを公開用で作成しました"
            : "スニペットをプライベート用で作成しました"
        );
        reset();
        setContentBlocks([]);
        setSelectedCategory(null);
        setSelectedTags([]);
      } else {
        toast.error("スニペットの作成に失敗しました");
      }
    } catch {
      toast.error("スニペットの作成に失敗しました");
    }
  };

  const handlePrivateSubmit = handleSubmit((data) => onSubmit(data, false));

  const handlePublicSubmit = handleSubmit((data) => onSubmit(data, true));

  const addMarkdown = () => {
    const contentId = contentBlocks.map((contentBlock) => {
      return contentBlock.id;
    });
    const contentOrder = contentBlocks.map((contentBlock) => {
      return contentBlock.order;
    });
    const MaxId = contentBlocks.length === 0 ? 0 : Math.max(...contentId);
    const MaxOrder = contentBlocks.length === 0 ? 0 : Math.max(...contentOrder);
    setContentBlocks([
      ...contentBlocks,
      {
        id: MaxId + 1,
        type: "markdown",
        content: "",
        order: MaxOrder + 1,
      },
    ]);
  };

  const addPreviewCode = () => {
    const contentId = contentBlocks.map((contentBlock) => {
      return contentBlock.id;
    });
    const contentOrder = contentBlocks.map((contentBlock) => {
      return contentBlock.order;
    });
    const MaxId = contentBlocks.length === 0 ? 0 : Math.max(...contentId);
    const MaxOrder = contentBlocks.length === 0 ? 0 : Math.max(...contentOrder);
    setContentBlocks([
      ...contentBlocks,
      {
        id: MaxId + 1,
        type: "preview",
        content: "",
        order: MaxOrder + 1,
        code: "",
        template: "react-ts" as TemplateType,
        files: {},
      },
    ]);
  };

  const addText = () => {
    const contentId = contentBlocks.map((contentBlock) => {
      return contentBlock.id;
    });
    const contentOrder = contentBlocks.map((contentBlock) => {
      return contentBlock.order;
    });
    const MaxId = contentBlocks.length === 0 ? 0 : Math.max(...contentId);
    const MaxOrder = contentBlocks.length === 0 ? 0 : Math.max(...contentOrder);
    setContentBlocks([
      ...contentBlocks,
      {
        id: MaxId + 1,
        type: "text",
        content: "",
        order: MaxOrder + 1,
      },
    ]);
  };

  const contentBlockDelete = (id: number) => {
    setContentBlocks(contentBlocks.filter((block) => block.id !== id));
  };

  const contentBlockOrder = (order: number) => {
    setContentBlocks((prev) => {
      const i = prev.findIndex((a) => a.order === order);
      const j = prev.findIndex((b) => b.order === order - 1);
      if (j === -1) return prev;

      const next = prev.map((b) => ({ ...b }));
      [next[i].order, next[j].order] = [next[j].order, next[i].order];

      next.sort((a, b) => a.order - b.order);
      return next;
    });
  };

  return (
    <div>
      <h2 className="text-left text-color-text-black text-2xl md:text-3xl font-bold">
        スニペット作成
      </h2>
      <div className="mt-10">
        <form className="w-full">
          <div>
            <Label htmlFor="name">タイトル</Label>
            <Input
              type="title"
              id="title"
              placeholder="例：Reactで使えるカスタムフック集"
              required
              disabled={isSubmitting}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-color-danger">{errors.title.message}</p>
            )}
          </div>
          <div className="mt-4">
            <Label htmlFor="description">概要・使い方</Label>
            <Input
              type="description"
              id="description"
              placeholder="このスニペットが解決する課題や使い方を簡潔に説明してください。"
              required
              disabled={isSubmitting}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-color-danger">{errors.description.message}</p>
            )}
          </div>
          <div className="mt-4">
            <Label htmlFor="category">カテゴリ</Label>
            <Select
              placeholder="カテゴリを選んでください"
              isClearable
              classNamePrefix="select"
              options={categoryOptions}
              components={{
                IndicatorSeparator: () => null,
              }}
              value={selectedCategory}
              onChange={handleCategoryChange}
              isDisabled={isSubmitting}
            />
            {errors.category && (
              <p className="text-color-danger">{errors.category.message}</p>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="tag">タグ</Label>
            <Select
              placeholder="タグを選んでください"
              isMulti
              classNamePrefix="select"
              options={tagOptions}
              components={{
                IndicatorSeparator: () => null,
              }}
              value={selectedTags}
              onChange={handleTagsChange}
              isDisabled={isSubmitting}
            />
            {errors.tag && (
              <p className="text-color-danger">{errors.tag.message}</p>
            )}
          </div>

          <div className="mt-8">
            <Label htmlFor="contents">コンテンツ</Label>
            <span className="text-sm text-gray-500">
              {contentBlocks.length > 0
                ? `${contentBlocks.length}個のブロック`
                : "少なくとも1つ追加してください"}
            </span>
            <AddContentBlockButtons
              addMarkdown={() => addMarkdown()}
              addText={() => addText()}
              addPreviewCode={() => addPreviewCode()}
              disabled={isSubmitting}
            />
            {contentBlocks.map((contentBlock) => {
              return (
                <div
                  className="mt-4"
                  key={contentBlock.id}
                  id={`${contentBlock.order}`}
                >
                  {contentBlock.type === "markdown" && (
                    <>
                      <ContentBlockActions
                        contentBlockDelete={() =>
                          contentBlockDelete(contentBlock.id)
                        }
                        contentBlockOrder={() =>
                          contentBlockOrder(contentBlock.order)
                        }
                        disabled={isSubmitting}
                      />
                      <MarkdownEditor
                        onChange={(newValue) =>
                          handleMarkdownChange(contentBlock.id, newValue)
                        }
                        value={contentBlock.content}
                        disabled={isSubmitting}
                      />
                    </>
                  )}
                  {contentBlock.type === "text" && (
                    <>
                      <ContentBlockActions
                        contentBlockDelete={() =>
                          contentBlockDelete(contentBlock.id)
                        }
                        contentBlockOrder={() =>
                          contentBlockOrder(contentBlock.order)
                        }
                        disabled={isSubmitting}
                      />
                      <TiptapEditor
                        sentence={contentBlock.content}
                        setSentence={(newValue) =>
                          handleTextChange(contentBlock.id, newValue)
                        }
                        disabled={isSubmitting}
                      />
                    </>
                  )}
                  {contentBlock.type === "preview" && (
                    <>
                      <ContentBlockActions
                        contentBlockDelete={() =>
                          contentBlockDelete(contentBlock.id)
                        }
                        contentBlockOrder={() =>
                          contentBlockOrder(contentBlock.order)
                        }
                        disabled={isSubmitting}
                      />
                      <CustomSandpack
                        contentCode={contentBlock.code}
                        initialTemplate={contentBlock.template}
                        onCodeChange={(newCode, template, files) =>
                          handlePreviewChange(
                            contentBlock.id,
                            newCode,
                            template,
                            files
                          )
                        }
                        disabled={isSubmitting}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex sm:flex-row">
            <PublicButton
              isSubmitting={isSubmitting}
              onClick={handlePrivateSubmit}
              className="bg-white text-black border border-gray-300 hover:bg-gray-50"
            >
              プライベート用に保存
            </PublicButton>

            <PublicButton
              isSubmitting={isSubmitting}
              onClick={handlePublicSubmit}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              公開用に保存
            </PublicButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSnippet;
