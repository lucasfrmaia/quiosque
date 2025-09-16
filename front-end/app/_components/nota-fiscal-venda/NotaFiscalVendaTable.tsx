import { FC, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { NotaFiscalVenda } from '@/types/interfaces/entities';
import { SortIcon } from '../SortIcon';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { NotaDetails } from '../common/NotaDetails';

interface NotaFiscalVendaTableProps {
  items: NotaFiscalVenda[];
  filterValues: {
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
  onSort: (field: string) => void;
  onEdit: (nota: NotaFiscalVenda) => void;
  onDelete: (nota: NotaFiscalVenda) => void;
}

export const NotaFiscalVendaTable: FC<NotaFiscalVendaTableProps> = ({
  items,
  filterValues,
  onSort,
  onEdit,
  onDelete,
}) => {
  const [selectedNota, setSelectedNota] = useState<NotaFiscalVenda | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openDetails = (nota: NotaFiscalVenda) => {
    setSelectedNota(nota);
    setIsDetailsOpen(true);
  };

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
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Nenhuma nota fiscal de venda encontrada.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
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
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((nota) => (
              <TableRow key={nota.id} className="hover:bg-accent/50">
                <TableCell className="font-medium">{nota.id}</TableCell>
                <TableCell>R$ {nota.total.toFixed(2)}</TableCell>
                <TableCell>{new Date(nota.data).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{nota.produtos?.length || 0}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openDetails(nota)}>
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(nota)}>
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(nota)}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedNota && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <NotaDetails nota={selectedNota} isCompra={false} onClose={() => setIsDetailsOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};