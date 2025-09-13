import Select from "react-select";
import { SnippetFiltersProps } from "../_type/snippetFilters";

const SnippetFilters: React.FC<SnippetFiltersProps> = ({
  searchText,
  selectedCategory,
  selectedTags,
  selectedDate,
  setSearchText,
  setSelectedCategory,
  setSelectedTags,
  setSelectedDate,
  categoryOptions,
  tagOptions,
}) => {
  return (
    <>
      <div className="flex gap-2 flex-wrap mt-5">
        <input
          className="px-2 w-full sm:w-[calc(50%-8px)] lg:w-64 rounded border border-color-border h-9"
          type="text"
          placeholder="スニペットを検索..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          placeholder="カテゴリを選んでください"
          className="w-full sm:w-[calc(50%-8px)] lg:w-64"
          isClearable
          classNamePrefix="select"
          options={categoryOptions}
          components={{
            IndicatorSeparator: () => null,
          }}
          value={selectedCategory}
          onChange={(category) => {
            setSelectedCategory(category);
          }}
        />
        <Select
          placeholder="タグを選んでください"
          className="w-full sm:w-[calc(50%-8px)] lg:w-64"
          isMulti
          classNamePrefix="select"
          options={tagOptions}
          components={{
            IndicatorSeparator: () => null,
          }}
          value={selectedTags}
          onChange={(tag) => {
            setSelectedTags(tag);
          }}
        />
        <input
          className="px-2 w-full sm:w-[calc(50%-8px)] lg:w-64 rounded border border-color-border h-9"
          type="date"
          placeholder="更新日"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
          }}
        />
      </div>
    </>
  );
};

export default SnippetFilters;
