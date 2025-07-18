import {
  Pagination,
  PaginationContent,
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

  return (
    <Pagination>
      <PaginationContent>
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
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page !== currentPage) onPageChange(page);
              }}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
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
