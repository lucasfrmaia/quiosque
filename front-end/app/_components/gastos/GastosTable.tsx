import { FC } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { SortIcon } from '../SortIcon';
import { ProdutoCompra } from '@/types/interfaces/entities';

interface GastosTableProps {
  items: ProdutoCompra[];
  filterValues: {
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
  onSort: (field: string) => void;
  onEdit: (item: ProdutoCompra) => void;
  onDelete: (id: number) => void;
}

export const GastosTable: FC<GastosTableProps> = ({
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
              <TableHead>Produto</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Nenhuma compra encontrada.
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
                <span>Produto</span>
                <SortIcon 
                  field="produto.nome" 
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
              onClick={() => onSort('data')}
            >
              <div className="flex items-center space-x-1">
                <span>Data</span>
                <SortIcon 
                  field="data" 
                  currentSortField={filterValues.sortField} 
                  currentSortDirection={filterValues.sortDirection} 
                />
              </div>
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(gasto => (
            <TableRow key={gasto.id} className="hover:bg-accent/50">
              <TableCell className="font-medium">{gasto.produto?.nome || 'N/A'}</TableCell>
              <TableCell>R$ {gasto.preco.toFixed(2)}</TableCell>
              <TableCell>{gasto.quantidade} {gasto.unidade}</TableCell>
              <TableCell>{new Date(gasto.data).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(gasto)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(gasto.id)}>
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