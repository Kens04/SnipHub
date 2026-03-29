interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages === 0) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        className="px-4 py-2 rounded border disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        前へ
      </button>

      <span className="text-sm">
        {currentPage} / {totalPages}
      </span>

      <button
        className="px-4 py-2 rounded border disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        次へ
      </button>
    </div>
  );
};

export default Pagination;