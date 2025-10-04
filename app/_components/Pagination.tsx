import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startIndex: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const itemsPerPageOptions = [5, 10, 15, 20];

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  startIndex,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const getVisiblePages = () => {
    const delta = 1;
    const range = [];

    const totalPageToIterate = Math.min(totalPages - 1, currentPage + delta);
    const startIndex = Math.max(2, currentPage - delta);

    for (let i = startIndex; i <= totalPageToIterate; i++) {
      range.push(i);
    }
    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }
    if (totalPages > 1) {
      range.unshift(1);
      range.push(totalPages);
    }
    return range;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
      {/* Info and Items per page */}
      <div className="flex flex-1 items-center justify-between sm:justify-start">
        <div className="text-sm text-gray-700 flex-shrink-0">
          Mostrando <span className="font-medium">{startIndex + 1}</span> até{' '}
          <span className="font-medium">{Math.min(startIndex + itemsPerPage, totalItems)}</span> de{' '}
          <span className="font-medium">{totalItems}</span> resultados
        </div>
        <div className="ml-4 flex sm:ml-6 items-center space-x-2">
          <span className="text-sm text-gray-500">Itens por página:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white shadow-sm border"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pagination buttons */}
      <div className="flex justify-center items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0 rounded-full border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Anterior</span>
        </Button>

        {visiblePages.map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`h-9 w-9 p-0 rounded-full ${
              page === currentPage
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            {page === '...' ? <MoreHorizontal className="h-4 w-4" /> : page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0 rounded-full border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Próximo</span>
        </Button>
      </div>
    </div>
  );
};
