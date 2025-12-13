import { useAuthDataFetch } from "@/app/_hooks/useAuthDataFetch";

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface CategoriesResponse {
  categories?: Category[];
}

interface TagsResponse {
  tags?: Tag[];
}

export const useAllCategoriesAndTags = (token: string | null) => {
  const { data: categoriesData } = useAuthDataFetch<CategoriesResponse>(
    token ? "/api/category" : null,
    token
  );

  const { data: tagsData } = useAuthDataFetch<TagsResponse>(
    token ? "/api/tag" : null,
    token
  );

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.categories || [];

  const tags = Array.isArray(tagsData) ? tagsData : tagsData?.tags || [];

  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  const tagOptions = tags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
  }));

  return {
    categoryOptions,
    tagOptions,
  };
};
