import { FC } from 'react';
import { Produto, FilterValues } from '@/types/interfaces/entities';
import { DataTable } from '../DataTable';

interface ProdutoTableProps {
  items: Produto[];
  filterValues: FilterValues;
  onSort: (field: string) => void;
  onEdit: (item: Produto) => void;
  onDelete: (id: number) => void;
}

export const ProdutoTable: FC<ProdutoTableProps> = ({
  items,
  filterValues,
  onSort,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'nome',
      header: 'Nome',
      sortKey: 'nome',
      render: (item: Produto) => item.nome,
      sortable: true,
      sorter: (a: Produto, b: Produto) => a.nome.localeCompare(b.nome),
    },
    {
      key: 'categoria',
      header: 'Categoria',
      render: (item: Produto) => item.categoria?.name || 'N/A',
      sortable: false,
    },
  ];

  return (
    <DataTable<Produto>
      items={items}
      columns={columns}
      filterValues={filterValues}
      onSort={onSort}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyMessage="Nenhum produto encontrado."
    />
  );
};