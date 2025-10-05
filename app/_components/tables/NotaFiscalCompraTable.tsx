import { FC, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Box } from 'lucide-react';
import { NotaFiscalCompra, FilterValues } from '@/types/interfaces/entities';
import { DataTable } from '../DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NotaDetails } from '../common/NotaDetails';
import { HeaderNotaModal } from '../modals/HeaderNotaMotal';

interface NotaFiscalCompraTableProps {
  items: NotaFiscalCompra[];
  filterValues: FilterValues;
  onSort: (field: string) => void;
  onEdit: (nota: NotaFiscalCompra) => void;
  onDelete: (id: NotaFiscalCompra) => void;
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
      key: 'imagem',
      header: 'Imagem',
      render: (item: NotaFiscalCompra) => (
        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
          <Box className="h-6 w-6 text-gray-400" />
        </div>
      ),
      sortable: false,
    },
    {
      key: 'id',
      header: 'ID',
      render: (item: NotaFiscalCompra) => item.id,
    },
    {
      key: 'fornecedor',
      header: 'Fornecedor',
      sortKey: 'fornecedor.nome',
      render: (item: NotaFiscalCompra) => (
        <div className="space-y-1">
          <div className="font-bold text-sm">{item.fornecedor?.nome || 'N/A'}</div>
        </div>
      ),
      sortable: true,
      sorter: (a: NotaFiscalCompra, b: NotaFiscalCompra) =>
        (a.fornecedor?.nome || '').localeCompare(b.fornecedor?.nome || ''),
    },
    {
      key: 'total',
      header: 'Total',
      sortKey: 'total',
      render: (item: NotaFiscalCompra) => (
        <div className="font-bold text-sm">R$ {item.total.toFixed(2)}</div>
      ),
      sortable: true,
      sorter: (a: NotaFiscalCompra, b: NotaFiscalCompra) => a.total - b.total,
    },
    {
      key: 'data',
      header: 'Data',
      render: (item: NotaFiscalCompra) => new Date(item.data).toLocaleDateString('pt-BR'),
      sortable: true,
      sorter: (a: NotaFiscalCompra, b: NotaFiscalCompra) =>
        new Date(a.data).getTime() - new Date(b.data).getTime(),
    },
    {
      key: 'produtos',
      header: 'Total de Itens',
      render: (item: NotaFiscalCompra) => item.total || 0,
      sortable: false,
    },
    {
      key: 'status',
      header: 'Ativo',
      render: (item: NotaFiscalCompra) => (
        <Badge variant={item.ativo ? 'default' : 'destructive'}>{item.ativo ? 'Sim' : 'Não'}</Badge>
      ),
      sortable: false,
    },
  ];

  return (
    <>
      <DataTable<NotaFiscalCompra>
        items={items}
        columns={columns}
        filterValues={filterValues}
        actions={{
          onEdit,
          onDelete,
          onView: openDetails,
        }}
        emptyMessage="Nenhuma nota fiscal de compra encontrada."
      />
      {selectedNota && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Detalhes da Nota Fiscal
              </DialogTitle>
            </DialogHeader>
            <HeaderNotaModal nota={selectedNota} />
            <NotaDetails nota={selectedNota} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
