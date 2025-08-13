const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || !onPageChange) return null;

  const { current_page, total_pages } = pagination;

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(total_pages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return { pages, startPage, endPage };
  };

  const { pages, startPage, endPage } = getVisiblePages();

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(current_page - 1)}
        disabled={current_page === 1}
        className={`px-4 py-2 rounded-lg font-medium ${
          current_page === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
        }`}
      >
        ← Previous
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg font-medium ${
            page === current_page
              ? "bg-primary text-white border border-primary"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Show last page if not in visible range */}
      {endPage < total_pages && (
        <>
          {endPage < total_pages - 1 && (
            <span className="px-2 text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(total_pages)}
            className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          >
            {total_pages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(current_page + 1)}
        disabled={current_page === total_pages}
        className={`px-4 py-2 rounded-lg font-medium ${
          current_page !== total_pages
            ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
            : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
        }`}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
