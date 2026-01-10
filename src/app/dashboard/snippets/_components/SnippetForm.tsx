import { Label } from "@/app/_components/Label";
import { Input } from "@/app/_components/Input";
import Select from "react-select";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { createSnippetType } from "../new/_types/createSnippet";
import { Category } from "../new/_types/category";
import { Tag } from "../new/_types/tag";
import { AddContentBlockButtons } from "../new/_components/AddContentBlockButtons";
import PublicButton from "../new/_components/PublicButton";
import { ContentBlockList } from "./ContentBlockList";
import { ContentBlock } from "../new/_types/contentBlock";
import { useAllCategoriesAndTags } from "../_hooks/useAllCategoriesAndTags";

interface SnippetFormProps {
  title: string;
  register: UseFormRegister<createSnippetType>;
  errors: FieldErrors<createSnippetType>;
  isSubmitting: boolean;
  selectedCategory: Category | null;
  selectedTags: Tag[];
  onCategoryChange: (category: Category | null) => void;
  onTagsChange: (tags: readonly Tag[]) => void;
  contentBlocks: ContentBlock[];
  onAddMarkdown: () => void;
  onAddText: () => void;
  onAddPreviewCode: () => void;
  onMarkdownChange: (id: number, newValue: string) => void;
  onTextChange: (id: number, newValue: string) => void;
  onPreviewChange: (
    id: number,
    newCode: string,
    template: string,
    files: Record<string, { code: string }>
  ) => void;
  onContentBlockDelete: (id: number) => void;
  onContentBlockOrder: (order: number) => void;
  onPrivateSubmit: () => void;
  onPublicSubmit: () => void;
}

export const SnippetForm: React.FC<SnippetFormProps> = ({
  title,
  register,
  errors,
  isSubmitting,
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagsChange,
  contentBlocks,
  onAddMarkdown,
  onAddText,
  onAddPreviewCode,
  onMarkdownChange,
  onTextChange,
  onPreviewChange,
  onContentBlockDelete,
  onContentBlockOrder,
  onPrivateSubmit,
  onPublicSubmit,
}) => {

  const { categoryOptions, tagOptions } = useAllCategoriesAndTags();

  return (
    <div>
      <h2 className="text-left text-color-text-black text-2xl md:text-3xl font-bold">
        {title}
      </h2>
      <div className="mt-10">
        <form className="w-full">
          <div>
            <Label htmlFor="name">タイトル</Label>
            <Input
              type="title"
              id="title"
              placeholder="例:Reactで使えるカスタムフック集"
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
              onChange={onCategoryChange}
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
              onChange={onTagsChange}
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
              addMarkdown={onAddMarkdown}
              addText={onAddText}
              addPreviewCode={onAddPreviewCode}
              disabled={isSubmitting}
            />
            <ContentBlockList
              contentBlocks={contentBlocks}
              isSubmitting={isSubmitting}
              onMarkdownChange={onMarkdownChange}
              onTextChange={onTextChange}
              onPreviewChange={onPreviewChange}
              onDelete={onContentBlockDelete}
              onOrderChange={onContentBlockOrder}
            />
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex sm:flex-row">
            <PublicButton
              isSubmitting={isSubmitting}
              onClick={onPrivateSubmit}
              className="bg-white text-black border border-gray-300 hover:bg-gray-50"
            >
              プライベート用に保存
            </PublicButton>

            <PublicButton
              isSubmitting={isSubmitting}
              onClick={onPublicSubmit}
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
