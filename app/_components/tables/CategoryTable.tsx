import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Box } from 'lucide-react';
import { Category, FilterValues } from '@/types/interfaces/entities';
import { DataTable } from '../DataTable';

interface CategoryTableProps {
  items: Category[];
  filterValues: FilterValues;
  onEdit: (item: Category) => void;
  onDelete: (id: Category) => void;
}

const columns = [
  {
    key: 'id',
    header: 'ID',
    render: (item: Category) => item.id,
    sortable: false,
  },
  {
    key: 'name',
    header: 'Nome',
    sortKey: 'name',
    render: (item: Category) => (
      <div className="space-y-1">
        <div className="font-bold text-sm">{item.name}</div>
      </div>
    ),
    sortable: true,
    sorter: (a: Category, b: Category) => a.name.localeCompare(b.name),
  },
  {
    key: 'produtos',
    header: 'Total de Produtos',
    render: (item: Category) => item.produtos?.length || 0,
    sortable: false,
  },
  {
    key: 'description',
    header: 'Descrição',
    render: (item: Category) => item.description?.slice(0, 18) + '...',
    sortable: false,
  },
];

export const CategoryTable: FC<CategoryTableProps> = ({
  items,
  filterValues,
  onEdit,
  onDelete,
}) => {
  return (
    <DataTable<Category>
      items={items}
      columns={columns}
      filterValues={filterValues}
      actions={{
        onEdit,
        onDelete,
      }}
      emptyMessage="Nenhuma categoria encontrada."
    />
  );
};
