import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Box } from 'lucide-react';
import { Category, FilterValues } from '@/types/interfaces/entities';
import { DataTable } from '../DataTable';

interface CategoryTableProps {
  items: Category[];
  filterValues: FilterValues;
  onSort: (field: string) => void;
  onEdit: (item: Category) => void;
  onDelete: (id: Category) => void;
}

export const CategoryTable: FC<CategoryTableProps> = ({
  items,
  filterValues,
  onSort,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'imagem',
      header: 'Imagem',
      render: (item: Category) => (
        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
          <Box className="h-6 w-6 text-gray-400" />
        </div>
      ),
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
      header: 'Número de Produtos',
      render: (item: Category) => item.produtos?.length || 0,
      sortable: false,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Category) => (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800"
        >
          Ativo
        </Badge>
      ),
      sortable: false,
    },
  ];

  return (
    <DataTable<Category>
      items={items}
      columns={columns}
      filterValues={filterValues}
      onSort={onSort}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyMessage="Nenhuma categoria encontrada."
    />
  );
};