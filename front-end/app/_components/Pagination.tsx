import { FC } from 'react';

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
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-700">
          Mostrando {startIndex + 1} até {Math.min(startIndex + itemsPerPage, totalItems)} de {totalItems} resultados
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Itens por página:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};