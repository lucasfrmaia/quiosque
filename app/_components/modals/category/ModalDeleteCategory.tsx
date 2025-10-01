import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ModalDeleteCategoryProps {
    isDeleteModalOpen: boolean;
    selectedCategory: { id: number; name: string } | null;
    setIsDeleteModalOpen: (open: boolean) => void;
    handleDeleteConfirm: () => void;
}

export function ModalDeleteCategory({
    isDeleteModalOpen,
    selectedCategory,
    setIsDeleteModalOpen,
    handleDeleteConfirm
}: ModalDeleteCategoryProps) {
    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir a categoria "{selectedCategory?.name}"? Esta ação não pode ser desfeita.
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