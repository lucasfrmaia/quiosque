import { FC } from 'react';
import { Fornecedor, FilterValues } from '@/types/interfaces/entities';
import { DataTable } from '../DataTable';

interface FornecedorTableProps {
  items: Fornecedor[];
  filterValues: FilterValues;
  onSort: (field: string) => void;
  onEdit: (item: Fornecedor) => void;
  onDelete: (id: number) => void;
}

export const FornecedorTable: FC<FornecedorTableProps> = ({
  items,
  filterValues,
  onSort,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (item: Fornecedor) => item.id,
      sortable: false,
    },
    {
      key: 'nome',
      header: 'Nome',
      sortKey: 'nome',
      render: (item: Fornecedor) => item.nome,
      sortable: true,
    },
    {
      key: 'cnpj',
      header: 'CNPJ',
      sortKey: 'cnpj',
      render: (item: Fornecedor) => item.cnpj || 'N/A',
      sortable: true,
    },
    {
      key: 'telefone',
      header: 'Telefone',
      sortKey: 'telefone',
      render: (item: Fornecedor) => item.telefone || 'N/A',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortKey: 'email',
      render: (item: Fornecedor) => item.email || 'N/A',
      sortable: true,
    },
  ];

  return (
    <DataTable<Fornecedor>
      items={items}
      columns={columns}
      filterValues={filterValues}
      onSort={onSort}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyMessage="Nenhum fornecedor encontrado."
    />
  );
};