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
import { Produto } from '@/types/interfaces/entities';

interface ProdutoTableProps {
  items: Produto[];
  filterValues: {
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
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
  if (items.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                Nenhum produto encontrado.
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
              onClick={() => onSort('nome')}
            >
              <div className="flex items-center space-x-1">
                <span>Nome</span>
                <SortIcon 
                  field="nome" 
                  currentSortField={filterValues.sortField} 
                  currentSortDirection={filterValues.sortDirection} 
                />
              </div>
            </TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((produto) => (
            <TableRow key={produto.id} className="hover:bg-accent/50">
              <TableCell className="font-medium">{produto.nome}</TableCell>
              <TableCell>{produto.categoria?.name || 'N/A'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(produto)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(produto.id)}>
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