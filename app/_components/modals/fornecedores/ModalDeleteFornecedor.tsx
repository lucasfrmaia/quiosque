import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModalDeleteFornecedorProps {
  isDeleteModalOpen: boolean;
  selectedFornecedor: { nome: string } | null;
  setIsDeleteModalOpen: (open: boolean) => void;
  handleDeleteConfirm: () => void;
}

export function ModalDeleteFornecedor({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedFornecedor,
  handleDeleteConfirm,
}: ModalDeleteFornecedorProps) {
  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o fornecedor "{selectedFornecedor?.nome}"? Esta ação não
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
