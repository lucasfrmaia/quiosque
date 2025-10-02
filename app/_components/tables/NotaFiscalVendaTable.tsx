import { FC, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Box, Receipt, X } from 'lucide-react';
import { NotaFiscalVenda, FilterValues } from '@/types/interfaces/entities';
import { DataTable } from '../DataTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { NotaDetails } from '../common/NotaDetails';
import { Button } from '@/components/ui/button';
import { HeaderNotaModal } from '../modals/HeaderNotaMotal';

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
      key: 'imagem',
      header: 'Imagem',
      render: (item: NotaFiscalVenda) => (
        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
          <Box className="h-6 w-6 text-gray-400" />
        </div>
      ),
      sortable: false,
    },
    {
      key: 'nome',
      header: 'Nome',
      render: (item: NotaFiscalVenda) => (
        <div className="space-y-1">
          <div className="font-bold text-sm">Nota Fiscal #{item.id}</div>
        </div>
      ),
      sortable: false,
    },
    {
      key: 'total',
      header: 'Total',
      sortKey: 'total',
      render: (item: NotaFiscalVenda) => (
        <div className="font-bold text-sm">R$ {item.total.toFixed(2)}</div>
      ),
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
      header: 'Estoque',
      render: (item: NotaFiscalVenda) => item.produtos?.length || 0,
      sortable: false,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: NotaFiscalVenda) => (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800"
        >
          Ativo
        </Badge>
      ),
      sortable: false,
    },
  ];

  return (
    <>
      <DataTable<NotaFiscalVenda>
        items={items}
        columns={columns}
        filterValues={filterValues}
        actions={{
          onEdit,
          onDelete,
          onView: openDetails,
        }}
        emptyMessage="Nenhuma nota fiscal de venda encontrada."
      />
      {selectedNota && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Detalhes da Nota Fiscal</DialogTitle>
            </DialogHeader>
            <HeaderNotaModal nota={selectedNota} />
            <NotaDetails nota={selectedNota} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};