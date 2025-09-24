import { FC, useState } from 'react';
import { NotaFiscalCompra, FilterValues } from '@/types/interfaces/entities';
import { DataTable } from '../DataTable';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { NotaDetails } from '../common/NotaDetails';

interface NotaFiscalCompraTableProps {
  items: NotaFiscalCompra[];
  filterValues: FilterValues;
  onSort: (field: string) => void;
  onEdit: (nota: NotaFiscalCompra) => void;
  onDelete: (id: number) => void;
}

export const NotaFiscalCompraTable: FC<NotaFiscalCompraTableProps> = ({
  items,
  filterValues,
  onSort,
  onEdit,
  onDelete,
}) => {
  const [selectedNota, setSelectedNota] = useState<NotaFiscalCompra | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openDetails = (nota: NotaFiscalCompra) => {
    setSelectedNota(nota);
    setIsDetailsOpen(true);
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (item: NotaFiscalCompra) => item.id,
      sortable: true,
      sorter: (a: NotaFiscalCompra, b: NotaFiscalCompra) => a.id - b.id,
    },
    {
      key: 'fornecedor',
      header: 'Fornecedor',
      render: (item: NotaFiscalCompra) => item.fornecedor?.nome || 'N/A',
      sortable: true,
      sorter: (a: NotaFiscalCompra, b: NotaFiscalCompra) => (a.fornecedor?.nome || '').localeCompare(b.fornecedor?.nome || ''),
    },
    {
      key: 'total',
      header: 'Total',
      render: (item: NotaFiscalCompra) => `R$ ${item.total.toFixed(2)}`,
      sortable: true,
      sorter: (a: NotaFiscalCompra, b: NotaFiscalCompra) => a.total - b.total,
    },
    {
      key: 'data',
      header: 'Data',
      render: (item: NotaFiscalCompra) => new Date(item.data).toLocaleDateString('pt-BR'),
      sortable: true,
      sorter: (a: NotaFiscalCompra, b: NotaFiscalCompra) => new Date(a.data).getTime() - new Date(b.data).getTime(),
    },
    {
      key: 'produtos',
      header: 'Produtos',
      render: (item: NotaFiscalCompra) => item.produtos?.length || 0,
      sortable: false,
    },
  ];

  return (
    <>
      <DataTable<NotaFiscalCompra>
        items={items}
        columns={columns}
        filterValues={filterValues}
        onSort={onSort}
        onEdit={onEdit}
        onDelete={(nota) => onDelete(nota.id)}
        onView={openDetails}
        emptyMessage="Nenhuma nota fiscal de compra encontrada."
      />
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