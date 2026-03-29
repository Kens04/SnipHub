"use client";

import Select, { MultiValue } from "react-select";

type Option = { value: string; label: string };

interface SidebarProps {
  mode?: "desktop" | "mobile";
  searchText?: string;
  selectedSort?: Option | null;
  selectedCategory?: Option | null;
  selectedTags?: MultiValue<Option>;
  selectedDate?: string;
  tagKeyword?: string;
  sortOptions?: Option[];
  categoryOptions?: Option[];
  filteredTagOptions?: Option[];
  setSearchText: (v: string) => void;
  setSelectedSort: (v: Option | null) => void;
  setSelectedCategory: (v: Option | null) => void;
  setSelectedTags: (v: MultiValue<Option>) => void;
  setSelectedDate: (v: string) => void;
  setTagKeyword: (v: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mode = "desktop",
  searchText,
  selectedSort,
  selectedCategory,
  selectedTags,
  selectedDate,
  sortOptions,
  categoryOptions,
  filteredTagOptions,
  setSearchText,
  setSelectedSort,
  setSelectedCategory,
  setSelectedTags,
  setSelectedDate,
}) => {

  console.log("テキスト", searchText);
  const isMobile = mode === "mobile";

  return (
    <aside
      className={
        isMobile
          ? "block w-full bg-white border border-color-border rounded-lg"
          : "hidden md:block bg-white w-[280px] left-0 top-0 min-h-screen absolute border-r border-color-border"
      }
    >
      <div className={isMobile ? "px-4 py-4" : "mt-[88px] px-4 md:px-6 pb-8"}>
        <input
          className="w-full h-10 px-4 rounded border border-color-border text-sm placeholder:text-color-text-gray"
          type="text"
          placeholder="スニペット検索..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-color-text-black">
            並び替え
          </h3>
          <Select
            className="mt-3"
            classNamePrefix="select"
            options={sortOptions}
            value={selectedSort}
            onChange={(option) => setSelectedSort(option)}
            components={{ IndicatorSeparator: () => null }}
          />
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-color-text-black">
            カテゴリ
          </h3>
          <Select
            className="mt-3"
            classNamePrefix="select"
            options={categoryOptions}
            isClearable
            value={selectedCategory}
            onChange={(option) => setSelectedCategory(option)}
            components={{ IndicatorSeparator: () => null }}
            placeholder="カテゴリを選んでください"
          />
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-color-text-black">タグ</h3>
          <Select
            className="mt-3"
            classNamePrefix="select"
            options={filteredTagOptions}
            isMulti
            value={selectedTags}
            onChange={(options) => setSelectedTags(options)}
            components={{ IndicatorSeparator: () => null }}
            placeholder="タグを選んでください"
          />
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-color-text-black">
            更新日
          </h3>
          <input
            className="mt-3 w-full h-10 px-4 rounded border border-color-border text-sm"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
    </aside>
  );
};
