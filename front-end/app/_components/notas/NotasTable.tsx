import { FC } from 'react';
import { NotaFiscal } from '@/types/interfaces/entities';
import { SortIcon } from '../SortIcon';

interface NotasTableProps {
  items: NotaFiscal[];
  filterValues: {
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
  onSort: (field: string) => void;
}

export const NotasTable: FC<NotasTableProps> = ({
  items,
  filterValues,
  onSort,
}) => {
  return (
    <div className="table-modern">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th onClick={() => onSort('produtoId')}>
              <div className="flex items-center space-x-1">
                <span>Produto ID</span>
                <SortIcon
                  field="produtoId"
                  currentSortField={filterValues.sortField}
                  currentSortDirection={filterValues.sortDirection}
                />
              </div>
            </th>
            <th onClick={() => onSort('quantidade')}>
              <div className="flex items-center space-x-1">
                <span>Quantidade</span>
                <SortIcon
                  field="quantidade"
                  currentSortField={filterValues.sortField}
                  currentSortDirection={filterValues.sortDirection}
                />
              </div>
            </th>
            <th onClick={() => onSort('total')}>
              <div className="flex items-center space-x-1">
                <span>Total</span>
                <SortIcon
                  field="total"
                  currentSortField={filterValues.sortField}
                  currentSortDirection={filterValues.sortDirection}
                />
              </div>
            </th>
            <th onClick={() => onSort('data')}>
              <div className="flex items-center space-x-1">
                <span>Data</span>
                <SortIcon
                  field="data"
                  currentSortField={filterValues.sortField}
                  currentSortDirection={filterValues.sortDirection}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((nota) => (
            <tr key={nota.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-gray-900">{nota.produtoId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900">{nota.quantidade}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900">R$ {nota.total.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900">{new Date(nota.data).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};