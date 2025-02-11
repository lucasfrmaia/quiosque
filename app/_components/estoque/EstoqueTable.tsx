import { FC } from 'react';
import { EstoqueItem, FilterValues } from '@/app/interfaces';
import { SortIcon } from '../SortIcon';
import { ActionButton } from '../ActionButton';

interface EstoqueTableProps {
  items: EstoqueItem[];
  filterValues: FilterValues;
  onSort: (field: string) => void;
  onEdit: (item: EstoqueItem) => void;
  onDelete: (id: number) => void;
}

export const EstoqueTable: FC<EstoqueTableProps> = ({
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
            <th onClick={() => onSort('nome')}>
              <div className="flex items-center space-x-1">
                <span>Nome</span>
                <SortIcon field="nome" currentSortField={filterValues.sortField} currentSortDirection={filterValues.sortDirection} />
              </div>
            </th>
            <th onClick={() => onSort('quantidade')}>
              <div className="flex items-center space-x-1">
                <span>Quantidade</span>
                <SortIcon field="quantidade" currentSortField={filterValues.sortField} currentSortDirection={filterValues.sortDirection} />
              </div>
            </th>
            <th onClick={() => onSort('preco')}>
              <div className="flex items-center space-x-1">
                <span>Preço</span>
                <SortIcon field="preco" currentSortField={filterValues.sortField} currentSortDirection={filterValues.sortDirection} />
              </div>
            </th>
            <th className="w-20">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{item.nome}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.quantidade}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900">R$ {item.preco.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                <ActionButton variant="edit" onClick={() => onEdit(item)} />
                <ActionButton variant="delete" onClick={() => onDelete(item.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};