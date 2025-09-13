import { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NotaFiscal } from '@/types/interfaces/entities';
import { SortIcon } from '../SortIcon';

interface NotasTableProps {
  items: NotaFiscal[];
  filterValues: {
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
  onSort: (field: string) => void;
}

export const NotasTable: FC<NotasTableProps> = ({
  items,
  filterValues,
  onSort,
}) => {
  if (items.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Produtos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Nenhuma nota fiscal encontrada.
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
              onClick={() => onSort('id')}
            >
              <div className="flex items-center space-x-1">
                <span>ID</span>
                <SortIcon 
                  field="id" 
                  currentSortField={filterValues.sortField} 
                  currentSortDirection={filterValues.sortDirection} 
                />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => onSort('total')}
            >
              <div className="flex items-center space-x-1">
                <span>Total</span>
                <SortIcon 
                  field="total" 
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
            <TableHead>Produtos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((nota) => (
            <TableRow key={nota.id} className="hover:bg-accent/50">
              <TableCell className="font-medium">{nota.id}</TableCell>
              <TableCell>R$ {nota.total.toFixed(2)}</TableCell>
              <TableCell>{new Date(nota.data).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>{nota.produtos?.length || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};