
const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  // Generate page numbers
  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const buttonStyle =
    "rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className={`${buttonStyle} border-zinc-700 text-zinc-300 hover:border-red-500 hover:bg-zinc-800`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          aria-label={`Go to page ${pageNumber}`}
          aria-current={currentPage === pageNumber ? "page" : undefined}
          className={`${buttonStyle} min-w-10 ${
            currentPage === pageNumber
              ? "border-red-600 bg-red-600 text-white"
              : "border-zinc-700 text-zinc-300 hover:border-red-500 hover:bg-zinc-800"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`${buttonStyle} border-zinc-700 text-zinc-300 hover:border-red-500 hover:bg-zinc-800`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
