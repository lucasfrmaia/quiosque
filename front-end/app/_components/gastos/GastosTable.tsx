import { FC } from 'react';
import { ProdutoCompra } from '@/types/interfaces/entities';
import { SortIcon } from '../SortIcon';
import { ActionButton } from '../ActionButton';

interface GastosTableProps {
  items: ProdutoCompra[];
  filterValues: {
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
  onSort: (field: string) => void;
  onEdit: (item: ProdutoCompra) => void;
  onDelete: (id: number) => void;
}

export const GastosTable: FC<GastosTableProps> = ({
  items,
  filterValues,
  onSort,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="table-modern">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th onClick={() => onSort('produto.nome')}>
              <div className="flex items-center space-x-1">
                <span>Produto</span>
                <SortIcon
                  field="produto.nome"
                  currentSortField={filterValues.sortField}
                  currentSortDirection={filterValues.sortDirection}
                />
              </div>
            </th>
            <th onClick={() => onSort('preco')}>
              <div className="flex items-center space-x-1">
                <span>Preço</span>
                <SortIcon
                  field="preco"
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
            <th className="w-20">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map(gasto => (
            <tr key={gasto.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                {gasto.produto?.nome || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                R$ {gasto.preco.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                {gasto.quantidade} {gasto.unidade}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                {new Date(gasto.data).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                <ActionButton variant="edit" onClick={() => onEdit(gasto)} />
                <ActionButton variant="delete" onClick={() => onDelete(gasto.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};