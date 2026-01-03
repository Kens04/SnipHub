"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { CreateSnippetSchema } from "./_lib/CreateSnippetSchema";
import { createSnippetType } from "./_types/createSnippet";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useState } from "react";
import { useAllCategoriesAndTags } from "../_hooks/useAllCategoriesAndTags";
import { Category } from "./_types/category";
import { Tag } from "./_types/tag";
import { useContentBlocks } from "../_hooks/useContentBlocks";
import { SnippetForm } from "../_components/SnippetForm";

const CreateSnippet: React.FC = () => {
  const { token } = useSupabaseSession();
  const { categoryOptions, tagOptions } = useAllCategoriesAndTags(token);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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

  const {
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
  } = useContentBlocks();

  const handleCategoryChange = (category: Category | null) => {
    setSelectedCategory(category);
    setValue("category", category?.value || "");
  };

  const handleTagsChange = (tags: readonly Tag[]) => {
    const tagsArray = tags ? [...tags] : [];
    setSelectedTags(tagsArray);
    const tagValues = tagsArray.map((t) => t.value).join(",");
    setValue("tag", tagValues);
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

  return (
    <SnippetForm
      title="スニペット作成"
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      categoryOptions={categoryOptions}
      tagOptions={tagOptions}
      selectedCategory={selectedCategory}
      selectedTags={selectedTags}
      onCategoryChange={handleCategoryChange}
      onTagsChange={handleTagsChange}
      contentBlocks={contentBlocks}
      onAddMarkdown={addMarkdown}
      onAddText={addText}
      onAddPreviewCode={addPreviewCode}
      onMarkdownChange={handleMarkdownChange}
      onTextChange={handleTextChange}
      onPreviewChange={handlePreviewChange}
      onContentBlockDelete={contentBlockDelete}
      onContentBlockOrder={contentBlockOrder}
      onPrivateSubmit={handlePrivateSubmit}
      onPublicSubmit={handlePublicSubmit}
    />
  );
};

export default CreateSnippet;