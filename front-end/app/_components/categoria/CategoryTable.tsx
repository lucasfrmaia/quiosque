import { FC } from 'react';
import { Category, FilterValues } from '@/types/interfaces/entities';
import { DataTable } from '../DataTable';

interface CategoryTableProps {
  items: Category[];
  filterValues: FilterValues;
  onSort: (field: string) => void;
  onEdit: (item: Category) => void;
  onDelete: (id: number) => void;
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
      key: 'name',
      header: 'Nome',
      sortKey: 'name',
      render: (item: Category) => item.name,
      sortable: true,
      sorter: (a: Category, b: Category) => a.name.localeCompare(b.name),
    },
    {
      key: 'produtos',
      header: 'Número de Produtos',
      render: (item: Category) => item.produtos?.length || 0,
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