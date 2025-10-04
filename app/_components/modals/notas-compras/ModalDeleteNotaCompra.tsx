import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { NotaFiscalCompra } from '@/types/interfaces/entities';

interface ModalDeleteNotaCompraProps {
  isDeleteModalOpen: boolean;
  selectedNota: NotaFiscalCompra | null;
  setIsDeleteModalOpen: (open: boolean) => void;
  handleDeleteConfirm: () => void;
}

export function ModalDeleteNotaCompra({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedNota,
  handleDeleteConfirm,
}: ModalDeleteNotaCompraProps) {
  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a nota fiscal de compra #{selectedNota?.id}? Esta ação
            não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDeleteConfirm}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
