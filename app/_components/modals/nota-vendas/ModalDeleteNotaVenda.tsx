import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModalDeleteNotaVendaProps {
  isDeleteModalOpen: boolean;
  selectedNota: { id: number } | null;
  setIsDeleteModalOpen: (open: boolean) => void;
  handleDeleteConfirm: () => void;
}

export function ModalDeleteNotaVenda({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedNota,
  handleDeleteConfirm,
}: ModalDeleteNotaVendaProps) {
  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a nota fiscal de venda #{selectedNota?.id}? Esta ação não
            pode ser desfeita.
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
