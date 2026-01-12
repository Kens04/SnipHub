import { SnippetsData } from "@/app/_types/snippet";
import { useMemo, useState } from "react";
import { MultiValue } from "react-select";
import toast from "react-hot-toast";

export const useSnippetFiltering = (
  data: SnippetsData | undefined,
  token: string | null,
  mutate: () => void
) => {
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    snippetId: number | null;
    snippetTitle: string;
  }>({
    isOpen: false,
    snippetId: null,
    snippetTitle: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<{
    value: string;
    label: string;
  } | null>({
    value: "",
    label: "",
  });
  const [selectedTags, setSelectedTags] = useState<
    MultiValue<{ value: string; label: string }>
  >([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const categories = Array.from(
    new Set((data?.snippets ?? []).map((s) => s.category.name))
  ).map((name) => ({ value: name, label: name }));

  const tags = Array.from(
    new Set<string>(
      (data?.snippets ?? [])
        .filter((s) => s.tags?.length)
        .reduce<
          string[]
        >((acc, s) => acc.concat(s.tags.map((x: { tag: { name: string } }) => x.tag?.name ?? x.tag.name).filter(Boolean) as string[]), [])
    )
  ).map((name) => ({ value: name, label: name }));

  const categoryOptions = categories?.map((category) => ({
    value: category.value,
    label: category.label,
  }));

  const tagOptions = tags?.map((tag) => ({
    value: tag.value,
    label: tag.label,
  }));

  const handleDeleteClick = async (id: number, title: string) => {
    setDeleteModal({
      isOpen: true,
      snippetId: id,
      snippetTitle: title,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      snippetId: null,
      snippetTitle: "",
    });
  };

  const onDeleteSuccess = () => {
    mutate();
    handleDeleteCancel();
  };

  const handleToggleVisibility = async (
    snippetId: number,
    title: string,
    isVisible: boolean
  ) => {
    try {
      toast.loading(
        `「${title}」のスニペットを${!isVisible ? "公開" : "非公開"}中です・・・`
      );

      const res = await fetch(`/api/snippet/${snippetId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isPublic: !isVisible,
        }),
      });

      toast.remove();

      if (res.ok) {
        toast.success(
          `「${title}」のスニペットを${!isVisible ? "公開" : "非公開"}にしました`
        );
        mutate();
      } else {
        toast.error(
          `「${title}」のスニペットを${!isVisible ? "公開" : "非公開"}に失敗しました`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredSnippets = useMemo(() => {
    if (!data?.snippets) return [];
    if (
      !searchText &&
      !selectedCategory?.value &&
      !selectedTags.length &&
      !selectedDate
    )
      return data?.snippets;
    return data?.snippets.filter(
      (snippet) =>
        (!searchText ||
          snippet.title.toLowerCase().includes(searchText.toLowerCase()) ||
          snippet.description
            .toLowerCase()
            .includes(searchText.toLowerCase())) &&
        (!selectedCategory?.value ||
          selectedCategory.value === snippet.category.name) &&
        (!selectedTags?.length ||
          snippet.tags?.some((t: { tag: { name: string } }) =>
            selectedTags
              .map((tag) => tag.value)
              .includes(t.tag?.name ?? t.tag.name)
          )) &&
        (!selectedDate ||
          new Date(snippet.updatedAt).toISOString().slice(0, 10) ===
            selectedDate)
    );
  }, [
    data?.snippets,
    searchText,
    selectedCategory,
    selectedTags,
    selectedDate,
  ]);

  return {
    searchText,
    selectedCategory,
    selectedTags,
    selectedDate,
    deleteModal,
    setSearchText,
    setSelectedCategory,
    setSelectedTags,
    setSelectedDate,
    categoryOptions,
    tagOptions,
    handleDeleteClick,
    handleDeleteCancel,
    onDeleteSuccess,
    handleToggleVisibility,
    filteredSnippets,
  };
};
