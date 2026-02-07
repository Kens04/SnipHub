"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useAuthDataFetch } from "@/app/_hooks/useAuthDataFetch";
import { SnippetsData } from "@/app/_types/snippet";
import { useSnippetFiltering } from "../_hooks/useSnippetFiltering";
import SnippetFilters from "../_components/SnippetFilters";
import { useMemo } from "react";
import SnippetFavoriteTable from "../_components/SnippetFavoriteTable";
import SnippetFavoriteTabs from "../_components/SnippetFavoriteTabs";
import { FavoriteModal } from "../../_components/snippets/FavoriteModal";

interface FavoriteResponse {
  id: number;
  userName: string;
  favorites: {
    id: number;
    createdAt: string;
    snippet: SnippetsData["snippets"][number];
  }[];
}

const FavoriteSnippet: React.FC = () => {
  const { token, user } = useSupabaseSession();
  const {
    data: rawData,
    error,
    isLoading,
    mutate,
  } = useAuthDataFetch<FavoriteResponse>(
    user && token ? `/api/user/${user.id}/favorites` : null,
    token,
  );

  const data: SnippetsData | undefined = useMemo(() => {
    if (!rawData?.favorites) return undefined;
    return {
      snippets: rawData.favorites.map((fav) => fav.snippet),
    };
  }, [rawData]);

  const {
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
    filteredSnippets,
  } = useSnippetFiltering(data, token, mutate);

  return (
    <div>
      <SnippetFavoriteTabs snippetType="all">
        {"お気に入り一覧"}
      </SnippetFavoriteTabs>
      <SnippetFilters
        searchText={searchText}
        selectedCategory={selectedCategory}
        selectedTags={selectedTags}
        selectedDate={selectedDate}
        setSearchText={setSearchText}
        setSelectedCategory={setSelectedCategory}
        setSelectedTags={setSelectedTags}
        setSelectedDate={setSelectedDate}
        categoryOptions={categoryOptions}
        tagOptions={tagOptions}
      />
      <SnippetFavoriteTable
        error={error}
        isLoading={isLoading}
        handleUnfavoriteClick={handleDeleteClick}
        filteredSnippets={filteredSnippets}
      />
      {deleteModal.isOpen && (
        <FavoriteModal
          title={deleteModal.snippetTitle}
          snippetId={deleteModal.snippetId}
          handleDeleteCancel={handleDeleteCancel}
          onDeleteSuccess={onDeleteSuccess}
          token={token}
        />
      )}
    </div>
  );
};

export default FavoriteSnippet;
