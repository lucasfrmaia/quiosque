import { FC } from 'react';
import { Fornecedor, FilterValues } from '@/types/interfaces/entities';
import { DataTable } from '../DataTable';

interface FornecedorTableProps {
  items: Fornecedor[];
  filterValues: FilterValues;
  onSort: (field: string) => void;
  onEdit: (fornecedor: Fornecedor) => void;
  onDelete: (fornecedor: Fornecedor) => void;
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
      sorter: (a: Fornecedor, b: Fornecedor) => a.nome.localeCompare(b.nome),
    },
    {
      key: 'cnpj',
      header: 'CNPJ',
      sortKey: 'cnpj',
      render: (item: Fornecedor) => item.cnpj || 'N/A',
      sortable: true,
      sorter: (a: Fornecedor, b: Fornecedor) => (a.cnpj || '').localeCompare(b.cnpj || ''),
    },
    {
      key: 'telefone',
      header: 'Telefone',
      sortKey: 'telefone',
      render: (item: Fornecedor) => item.telefone || 'N/A',
      sortable: true,
      sorter: (a: Fornecedor, b: Fornecedor) => (a.telefone || '').localeCompare(b.telefone || ''),
    },
    {
      key: 'email',
      header: 'Email',
      sortKey: 'email',
      render: (item: Fornecedor) => item.email || 'N/A',
      sortable: true,
      sorter: (a: Fornecedor, b: Fornecedor) => (a.email || '').localeCompare(b.email || ''),
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