import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTablePaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  itemsPerPage: number;
}

export function DataTablePagination({
  currentPage,
  onPageChange,
  totalCount,
  itemsPerPage,
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis logic
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    
    if (currentPage <= 4) {
      // Show first 5 pages, ellipsis, last page
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Show first page, ellipsis, last 5 pages
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination>
      <PaginationContent className="flex-wrap gap-1 sm:gap-2">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (hasPreviousPage) onPageChange(currentPage - 1);
            }}
            aria-disabled={!hasPreviousPage}
            style={{
              opacity: hasPreviousPage ? 1 : 0.5,
              pointerEvents: hasPreviousPage ? "auto" : "none",
            }}
          />
        </PaginationItem>
        {visiblePages.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page !== currentPage) onPageChange(page as number);
                }}
                isActive={currentPage === page}
                className="min-w-[2.25rem]"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (hasNextPage) onPageChange(currentPage + 1);
            }}
            aria-disabled={!hasNextPage}
            style={{
              opacity: hasNextPage ? 1 : 0.5,
              pointerEvents: hasNextPage ? "auto" : "none",
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
