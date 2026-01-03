"use client";

import { useForm } from "react-hook-form";
import { useAuthDataFetch } from "@/app/_hooks/useAuthDataFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { SnippetData } from "@/app/_types/snippet";
import { createSnippetType } from "../new/_types/createSnippet";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSnippetSchema } from "../new/_lib/CreateSnippetSchema";
import { useAllCategoriesAndTags } from "../_hooks/useAllCategoriesAndTags";
import { useEffect, useState } from "react";
import { Category } from "../new/_types/category";
import { Tag } from "../new/_types/tag";
import { TemplateType } from "../new/_types/template-type";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useContentBlocks } from "../_hooks/useContentBlocks";
import { SnippetForm } from "../_components/SnippetForm";

const EditSnippet = ({ params }: { params: { id: string } }) => {
  const { token, user } = useSupabaseSession();
  const { data } = useAuthDataFetch<SnippetData>(
    user && token ? `/api/snippet/${params.id}` : null,
    token
  );
  const router = useRouter();

  const { categoryOptions, tagOptions } = useAllCategoriesAndTags(token);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const {
    register,
    handleSubmit,
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

  const snippet = data?.snippet;

  useEffect(() => {
    if (!snippet) {
      return;
    }

    setValue("title", snippet.title);
    setValue("description", snippet.description);
    setSelectedCategory({
      value: String(snippet.category.id),
      label: snippet.category.name,
    });
    setSelectedTags(
      snippet.tags.map((tag) => ({
        value: String(tag.tag.id),
        label: tag.tag.name,
      }))
    );
    setContentBlocks(
      snippet.contentBlocks.map((contentBlock) => ({
        id: contentBlock.id,
        type: contentBlock.type,
        content: contentBlock.content || "",
        order: contentBlock.order,
        ...(contentBlock.type === "preview"
          ? {
              template: contentBlock.preview?.template as TemplateType,
              files: Array.isArray(contentBlock.preview?.files)
                ? contentBlock.preview.files.reduce<
                    Record<string, { code: string }>
                  >((acc, file) => {
                    acc[file.filePath] = { code: file.code };
                    return acc;
                  }, {})
                : contentBlock.preview?.files || {},
            }
          : {}),
      }))
    );
  }, [snippet, setValue, setContentBlocks]);

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

      const res = await fetch(`/api/snippet/${params.id}`, {
        method: "PUT",
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
            ? "スニペットを公開用で更新しました"
            : "スニペットをプライベート用で更新しました"
        );
        router.replace("/dashboard/snippets");
      } else {
        toast.error("スニペットの更新に失敗しました");
      }
    } catch {
      toast.error("スニペットの更新に失敗しました");
    }
  };

  const handlePrivateSubmit = handleSubmit((data) => onSubmit(data, false));
  const handlePublicSubmit = handleSubmit((data) => onSubmit(data, true));

  return (
    <SnippetForm
      title="スニペット編集"
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

export default EditSnippet;
