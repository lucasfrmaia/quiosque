import { FC } from 'react';
import { Produto } from '@/app/interfaces';
import { SortIcon } from '../SortIcon';
import { ActionButton } from '../ActionButton';

interface CardapioTableProps {
  items: Produto[];
  filterValues: {
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
  onSort: (field: string) => void;
  onEdit: (item: Produto) => void;
  onDelete: (id: number) => void;
}

export const CardapioTable: FC<CardapioTableProps> = ({
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
                <SortIcon
                  field="nome"
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
            <th>
              <div className="flex items-center space-x-1">
                <span>Descrição</span>
              </div>
            </th>
            <th className="w-20">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map(produto => (
            <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                {produto.nome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                R$ {produto.preco.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-gray-900">
                {produto.descricao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                <ActionButton variant="edit" onClick={() => onEdit(produto)} />
                <ActionButton variant="delete" onClick={() => onDelete(produto.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};