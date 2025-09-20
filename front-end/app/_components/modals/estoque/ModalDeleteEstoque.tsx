import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProdutoEstoque } from "@/types/interfaces/entities";

interface ModalDeleteEstoqueProps {
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (open: boolean) => void;
    handleDeleteConfirm: () => void;
    selectedItem: ProdutoEstoque | null;
}

export function ModalDeleteEstoque({ isDeleteModalOpen, setIsDeleteModalOpen, selectedItem, handleDeleteConfirm }: ModalDeleteEstoqueProps) {
    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir o item "{selectedItem?.produto?.nome}"? Esta ação não pode ser desfeita.
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