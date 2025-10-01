import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Box } from 'lucide-react';
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
      key: 'imagem',
      header: 'Imagem',
      render: (item: Fornecedor) => (
        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
          <Box className="h-6 w-6 text-gray-400" />
        </div>
      ),
      sortable: false,
    },
    {
      key: 'nome',
      header: 'Nome',
      sortKey: 'nome',
      render: (item: Fornecedor) => (
        <div className="space-y-1">
          <div className="font-bold text-sm">{item.nome}</div>
        </div>
      ),
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
    {
      key: 'status',
      header: 'Status',
      render: (item: Fornecedor) => (
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