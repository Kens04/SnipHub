import { Dispatch, ReactNode, SetStateAction } from "react";
import { MultiValue } from "react-select";

export interface SnippetTabProps {
  snippetType: string;
}

export interface SnippetTableProps {
  error: ReactNode;
  isLoading: boolean;
  handleDeleteClick: (id: number, title: string) => Promise<void>;
  handleToggleVisibility: (
    snippetId: number,
    title: string,
    isVisible: boolean
  ) => Promise<void>;
  filteredSnippets: {
    tags: {
      tag: { name: string };
    }[];
    category: {
      name: string;
    };
    name: string;
    description: string;
    id: number;
    isPublic: boolean;
    title: string;
    updatedAt: string;
  }[];
  snippetType: string;
}

export interface SnippetFiltersProps {
  searchText: string;
  selectedCategory: {
    value: string;
    label: string;
  } | null;
  selectedTags: MultiValue<{
    value: string;
    label: string;
  }>;
  selectedDate: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  setSelectedCategory: Dispatch<
    SetStateAction<{
      value: string;
      label: string;
    } | null>
  >;
  setSelectedTags: Dispatch<
    SetStateAction<
      MultiValue<{
        value: string;
        label: string;
      }>
    >
  >;
  setSelectedDate: Dispatch<SetStateAction<string>>;
  categoryOptions: {
    value: string;
    label: string;
  }[];
  tagOptions: {
    value: string;
    label: string;
  }[];
}
