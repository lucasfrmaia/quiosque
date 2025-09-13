import { FC } from 'react';
import { GastoDiario } from '@/types/interfaces/entities';
import { SortIcon } from '../SortIcon';
import { ActionButton } from '../ActionButton';

interface GastosTableProps {
  items: GastoDiario[];
  filterValues: {
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
  onSort: (field: string) => void;
  onEdit: (item: GastoDiario) => void;
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
            <th onClick={() => onSort('descricao')}>
              <div className="flex items-center space-x-1">
                <span>Descrição</span>
                <SortIcon
                  field="descricao"
                  currentSortField={filterValues.sortField}
                  currentSortDirection={filterValues.sortDirection}
                />
              </div>
            </th>
            <th onClick={() => onSort('valor')}>
              <div className="flex items-center space-x-1">
                <span>Valor</span>
                <SortIcon
                  field="valor"
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
                {gasto.descricao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                R$ {gasto.valor.toFixed(2)}
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