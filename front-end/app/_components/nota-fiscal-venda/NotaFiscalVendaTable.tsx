import { FC, useState } from 'react';
import { NotaFiscalVenda, FilterValues } from '@/types/interfaces/entities';
import { DataTable } from '../DataTable';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { NotaDetails } from '../common/NotaDetails';

interface NotaFiscalVendaTableProps {
  items: NotaFiscalVenda[];
  filterValues: FilterValues;
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

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (item: NotaFiscalVenda) => item.id,
      sortable: true,
      sorter: (a: NotaFiscalVenda, b: NotaFiscalVenda) => a.id - b.id,
    },
    {
      key: 'total',
      header: 'Total',
      render: (item: NotaFiscalVenda) => `R$ ${item.total.toFixed(2)}`,
      sortable: true,
      sorter: (a: NotaFiscalVenda, b: NotaFiscalVenda) => a.total - b.total,
    },
    {
      key: 'data',
      header: 'Data',
      render: (item: NotaFiscalVenda) => new Date(item.data).toLocaleDateString('pt-BR'),
      sortable: true,
      sorter: (a: NotaFiscalVenda, b: NotaFiscalVenda) => new Date(a.data).getTime() - new Date(b.data).getTime(),
    },
    {
      key: 'produtos',
      header: 'Produtos',
      render: (item: NotaFiscalVenda) => item.produtos?.length || 0,
      sortable: false,
    },
  ];

  return (
    <>
      <DataTable<NotaFiscalVenda>
        items={items}
        columns={columns}
        filterValues={filterValues}
        onSort={onSort}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={openDetails}
        emptyMessage="Nenhuma nota fiscal de venda encontrada."
      />
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