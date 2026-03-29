"use client";

import SnippetCard from "./_components/SnippetCard";
import toast from "react-hot-toast";
import { useEffect, useState, useMemo } from "react";
import { Sidebar } from "../_layout/Sidebar";
import { MultiValue } from "react-select";
import Pagination from "./_components/Pagination";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { useDataFetch } from "../_hooks/useDataFetch";

interface Option {
  value: string;
  label: string;
}

interface Snippet {
  id: number;
  title: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  user: { id: number; userName: string; iconUrl: string };
  likes: { userId: number }[];
  category: { name: string };
  tags: { tag: { name: string } }[];
}

interface SnippetApiResponse {
  snippet: Snippet[];
}

interface CurrentUserSummary {
  id: number;
  userName: string;
  iconUrl: string;
}

const Snippets: React.FC = () => {
  const { user } = useSupabaseSession();
  const [snippets, setSnippets] = useState<SnippetApiResponse | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedSort, setSelectedSort] = useState<Option | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [selectedTags, setSelectedTags] = useState<MultiValue<Option>>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [tagKeyword, setTagKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { data: currentUser } = useDataFetch<CurrentUserSummary>(
    user?.id ? `/api/user/${user.id}` : null,
  );
  const currentUserId = currentUser?.id;

  const sortOptions: Option[] = [
    { value: "newest", label: "新着順" },
    { value: "popular", label: "人気順" },
    { value: "updated", label: "更新順" },
  ];

  useEffect(() => {
    const AllSnippet = async () => {
      const res = await fetch("/api/snippet", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });

      if (!res.ok) {
        toast.error("スニペットの取得に失敗しました。");
        return;
      }

      const data: SnippetApiResponse = await res.json();
      setSnippets(data);
    };

    AllSnippet();
  }, []);

  const AllSnippets = useMemo(() => snippets?.snippet ?? [], [snippets]);

  const categoryOptions: Option[] = useMemo(() => {
    const names = AllSnippets.map(
      (snippet) => snippet.category?.name?.trim() ?? "",
    ).filter((name) => name !== "");
    const unique = Array.from(new Set(names));
    const options = unique.map((name) => ({ value: name, label: name }));
    return options.sort((a, b) => a.label.localeCompare(b.label, "ja"));
  }, [AllSnippets]);

  const tagOptions: Option[] = useMemo(() => {
    const tag = AllSnippets.flatMap((snippet) => snippet.tags ?? [])
      .map((tag) => tag.tag?.name?.trim() ?? "")
      .filter((name) => name !== "");
    const unique = Array.from(new Set(tag));
    const options = unique.map((name) => ({ value: name, label: name }));
    return options.sort((a, b) => a.label.localeCompare(b.label, "ja"));
  }, [AllSnippets]);

  const filteredTagOptions = useMemo(
    () =>
      tagOptions.filter((t) =>
        t.label.toLowerCase().includes(tagKeyword.toLowerCase()),
      ),
    [tagOptions, tagKeyword],
  );

  const filteredSnippets = () => {
    const filtered = AllSnippets.filter((snippet) => {
      if (
        searchText &&
        !snippet.title.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }

      if (
        selectedCategory &&
        snippet.category.name !== selectedCategory.value
      ) {
        return false;
      }

      if (selectedTags.length > 0) {
        const tagNames = snippet.tags.map((t) => t.tag.name);
        const hasTag = selectedTags.some((tag) => tagNames.includes(tag.value));
        if (!hasTag) return false;
      }

      if (selectedDate) {
        const snippetDate = new Date(snippet.updatedAt)
          .toISOString()
          .slice(0, 10);
        if (snippetDate !== selectedDate) {
          return false;
        }
      }

      return true;
    });

    return filtered.sort((a, b) => {
      if (selectedSort?.value === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      if (selectedSort?.value === "popular") {
        return b.likes.length - a.likes.length;
      }

      if (selectedSort?.value === "updated") {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }

      return 0;
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategory, selectedTags, selectedDate, selectedSort]);

  const filtered = filteredSnippets();
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSnippets = filtered.slice(startIndex, endIndex);

  const sidebarProps = {
    searchText,
    selectedSort,
    selectedCategory,
    selectedTags,
    selectedDate,
    tagKeyword,
    sortOptions,
    categoryOptions,
    filteredTagOptions,
    setSearchText,
    setSelectedSort,
    setSelectedCategory,
    setSelectedTags,
    setSelectedDate,
    setTagKeyword,
  };

  return (
    <div className="mt-20 md:mt-0 md:ml-[280px]">
      <h2 className="text-left text-color-text-black text-2xl md:text-3xl font-bold">
        スニペット一覧
      </h2>
      <Sidebar {...sidebarProps} mode="desktop" />
      <div className="mt-4 md:hidden">
        <Sidebar {...sidebarProps} mode="mobile" />
      </div>
      <div className="mt-10 grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
        {paginatedSnippets?.map((snippet) => {
          return (
            <SnippetCard
              key={snippet.id}
              id={String(snippet.id)}
              iconUrl={snippet.user.iconUrl}
              userName={snippet.user.userName}
              title={snippet.title}
              description={snippet.description}
              isLiked={
                currentUserId
                  ? snippet.likes.some((like) => like.userId === currentUserId)
                  : false
              }
              likeCount={snippet.likes.length}
              category={snippet.category.name}
              tag={snippet.tags[0]?.tag.name}
            />
          );
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Snippets;
