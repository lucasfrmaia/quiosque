import { FC } from 'react';
import { ProdutoEstoque, FilterValues } from '@/types/interfaces/entities';
import { DataTable } from '../DataTable';

interface EstoqueTableProps {
  items: ProdutoEstoque[];
  filterValues: FilterValues;
  onSort: (field: string) => void;
  onEdit: (item: ProdutoEstoque) => void;
  onDelete: (id: ProdutoEstoque) => void;
}

export const EstoqueTable: FC<EstoqueTableProps> = ({
  items,
  filterValues,
  onSort,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'produto',
      header: 'Nome',
      sortKey: 'produto.nome',
      render: (item: ProdutoEstoque) => item.produto?.nome || 'N/A',
      sortable: true,
      sorter: (a: ProdutoEstoque, b: ProdutoEstoque) => {
        const aName = a.produto?.nome || '';
        const bName = b.produto?.nome || '';
        return aName.localeCompare(bName);
      },
    },
    {
      key: 'quantidade',
      header: 'Quantidade',
      sortKey: 'quantidade',
      render: (item: ProdutoEstoque) => `${item.quantidade} ${item.unidade}`,
      sortable: true,
      sorter: (a: ProdutoEstoque, b: ProdutoEstoque) => a.quantidade - b.quantidade,
    },
    {
      key: 'preco',
      header: 'Preço',
      sortKey: 'preco',
      render: (item: ProdutoEstoque) => `R$ ${item.preco.toFixed(2)}`,
      sortable: true,
      sorter: (a: ProdutoEstoque, b: ProdutoEstoque) => a.preco - b.preco,
    },
    {
      key: 'dataValidade',
      header: 'Data Validade',
      render: (item: ProdutoEstoque) => item.dataValidade ? new Date(item.dataValidade).toLocaleDateString('pt-BR') : 'N/A',
      sortable: false,
    },
    {
      key: 'unidade',
      header: 'Unidade',
      render: (item: ProdutoEstoque) => item.unidade,
      sortable: false,
    },
  ];

  return (
    <DataTable<ProdutoEstoque>
      items={items}
      columns={columns}
      filterValues={filterValues}
      onSort={onSort}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyMessage="Nenhum item encontrado."
    />
  );
};