import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Box } from 'lucide-react';
import { ProdutoEstoque, FilterValues } from '@/types/interfaces/entities';
import { DataTable } from '../DataTable';

interface EstoqueTableProps {
  items: ProdutoEstoque[];
  filterValues: FilterValues;
  onEdit: (item: ProdutoEstoque) => void;
  onDelete: (id: ProdutoEstoque) => void;
}

const columns = [
  {
    key: 'imagem',
    header: 'Imagem',
    render: (item: ProdutoEstoque) => (
      <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
        {item.produto?.imagemUrl ? (
          <img
            src={item.produto.imagemUrl}
            alt={item.produto.nome}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <Box className="h-6 w-6 text-gray-400" />
        )}
      </div>
    ),
    sortable: false,
  },
  {
    key: 'id',
    header: 'ID',
    render: (item: ProdutoEstoque) => item.id,
    sortable: false,
  },
  {
    key: 'produto',
    header: 'Nome',
    sortKey: 'produto.nome',
    render: (item: ProdutoEstoque) => (
      <div className="space-y-1">
        <div className="font-bold text-sm">{item.produto?.nome || 'N/A'}</div>
        <div className="text-gray-500 text-xs line-clamp-2">
          {item.produto?.descricao || 'Sem descrição'}
        </div>
      </div>
    ),
    sortable: true,
    sorter: (a: ProdutoEstoque, b: ProdutoEstoque) => {
      const aName = a.produto?.nome || '';
      const bName = b.produto?.nome || '';
      return aName.localeCompare(bName);
    },
  },
  {
    key: 'categoria',
    header: 'Categoria',
    render: (item: ProdutoEstoque) => item.produto?.categoria?.name || 'N/A',
    sortable: false,
  },
  {
    key: 'preco',
    header: 'Preço',
    sortKey: 'preco',
    render: (item: ProdutoEstoque) => (
      <div className="font-bold text-sm">R$ {item.preco.toFixed(2)}</div>
    ),
    sortable: true,
    sorter: (a: ProdutoEstoque, b: ProdutoEstoque) => a.preco - b.preco,
  },
  {
    key: 'estoque',
    header: 'Estoque',
    sortKey: 'quantidade',
    render: (item: ProdutoEstoque) => (
      <div className="text-sm">
        {item.quantidade} {item.unidade}
      </div>
    ),
    sortable: true,
    sorter: (a: ProdutoEstoque, b: ProdutoEstoque) => a.quantidade - b.quantidade,
  },
  {
    key: 'status',
    header: 'Estocável',
    render: (item: ProdutoEstoque) => (
      <Badge variant={item.estocavel ? 'default' : 'destructive'}>
        {item.estocavel ? 'Sim' : 'Não'}
      </Badge>
    ),
    sortable: false,
  },
  {
    key: 'dataValidade',
    header: 'Validade',
    render: (item: ProdutoEstoque) =>
      item.dataValidade ? new Date(item.dataValidade).toLocaleDateString('pt-BR') : 'N/A',
    sortable: false,
  },
];

export const EstoqueTable: FC<EstoqueTableProps> = ({ items, filterValues, onEdit, onDelete }) => {
  return (
    <DataTable<ProdutoEstoque>
      items={items}
      columns={columns}
      filterValues={filterValues}
      actions={{
        onEdit,
        onDelete,
      }}
      emptyMessage="Nenhum item encontrado."
    />
  );
};
