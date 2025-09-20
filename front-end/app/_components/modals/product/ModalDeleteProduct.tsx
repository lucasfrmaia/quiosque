import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Produto } from "@/types/interfaces/entities";

interface ModalDeleteProductProps {
    isDeleteModalOpen: boolean;
    selectedProduto: Produto | null;
    setIsDeleteModalOpen: (open: boolean) => void;
    handleDeleteConfirm: () => void;
}

export function ModalDeleteProduct({ isDeleteModalOpen, setIsDeleteModalOpen, selectedProduto, handleDeleteConfirm }: ModalDeleteProductProps) {

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o produto "{selectedProduto?.nome}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}