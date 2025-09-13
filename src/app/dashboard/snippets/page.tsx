"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useAuthDataFetch } from "@/app/_hooks/useAuthDataFetch";
import { SnippetData } from "@/app/_types/snippet";
import { Modal } from "../_components/snippets/Modal";
import { Toaster } from "react-hot-toast";
import { useSnippetFiltering } from "./_hooks/useSnippetFiltering";
import SnippetTable from "./_components/SnippetTable";
import SnippetTabs from "./_components/SnippetTabs";
import SnippetFilters from "./_components/SnippetFilters";

const Snippets: React.FC = () => {
  const { token, user } = useSupabaseSession();
  const { data, error, isLoading, mutate } = useAuthDataFetch<SnippetData>(
    user && token ? `/api/user/${user.id}/snippets` : null,
    token
  );
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
    handleToggleVisibility,
    filteredSnippets,
  } = useSnippetFiltering(data, token, mutate);

  return (
    <div>
      <Toaster />
      <SnippetTabs snippetType="all" />
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
      <SnippetTable
        error={error}
        isLoading={isLoading}
        handleDeleteClick={handleDeleteClick}
        handleToggleVisibility={handleToggleVisibility}
        filteredSnippets={filteredSnippets}
        snippetType="all"
      />
      {deleteModal.isOpen ? (
        <Modal
          title={deleteModal.snippetTitle}
          snippetId={deleteModal.snippetId}
          handleDeleteCancel={handleDeleteCancel}
          onDeleteSuccess={onDeleteSuccess}
          token={token}
        />
      ) : null}
    </div>
  );
};

export default Snippets;
