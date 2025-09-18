import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { SortIcon } from '@/app/_components/SortIcon';
import { ProdutoEstoque } from '@/types/interfaces/entities';

interface EstoqueTableProps {
  items: ProdutoEstoque[];
  filterValues: {
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
  onSort: (field: string) => void;
  onEdit: (item: ProdutoEstoque) => void;
  onDelete: (id: number) => void;
}

export const EstoqueTable: FC<EstoqueTableProps> = ({
  items,
  filterValues,
  onSort,
  onEdit,
  onDelete,
}) => {
  if (items.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nome</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Data Validade</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum item encontrado.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('produto.nome')}
            >
              <div className="flex items-center space-x-1">
                <span>Nome</span>
                <SortIcon
                  field="produto.nome"
                  currentSortField={filterValues.sortField}
                  currentSortDirection={filterValues.sortDirection}
                />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => onSort('quantidade')}
            >
              <div className="flex items-center space-x-1">
                <span>Quantidade</span>
                <SortIcon 
                  field="quantidade" 
                  currentSortField={filterValues.sortField} 
                  currentSortDirection={filterValues.sortDirection} 
                />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => onSort('preco')}
            >
              <div className="flex items-center space-x-1">
                <span>Preço</span>
                <SortIcon 
                  field="preco" 
                  currentSortField={filterValues.sortField} 
                  currentSortDirection={filterValues.sortDirection} 
                />
              </div>
            </TableHead>
            <TableHead>Data Validade</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-accent/50">
              <TableCell className="font-medium">{item.produto?.nome || 'N/A'}</TableCell>
              <TableCell>{item.quantidade} {item.unidade}</TableCell>
              <TableCell>R$ {item.preco.toFixed(2)}</TableCell>
              <TableCell>{item.dataValidade ? new Date(item.dataValidade).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
              <TableCell>{item.unidade}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};