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
import { NotaFiscalCompra } from '@/types/interfaces/entities';
import { SortIcon } from '../SortIcon';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { NotaDetails } from '../common/NotaDetails';

interface NotaFiscalCompraTableProps {
  items: NotaFiscalCompra[];
  onEdit: (nota: NotaFiscalCompra) => void;
  onDelete: (nota: NotaFiscalCompra) => void;
}

export const NotaFiscalCompraTable: FC<NotaFiscalCompraTableProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  const [selectedNota, setSelectedNota] = useState<NotaFiscalCompra | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openDetails = (nota: NotaFiscalCompra) => {
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
              <TableHead>Fornecedor</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhuma nota fiscal de compra encontrada.
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
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
            
                </div>
              </TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead 
                className="cursor-pointer" 
              >
                <div className="flex items-center space-x-1">
                  <span>Total</span>
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
              >
                <div className="flex items-center space-x-1">
                  <span>Data</span>
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
                <TableCell>{nota.fornecedor?.nome || 'N/A'}</TableCell>
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
            <NotaDetails nota={selectedNota} isCompra={true} onClose={() => setIsDetailsOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};