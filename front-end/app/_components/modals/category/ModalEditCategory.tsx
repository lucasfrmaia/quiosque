import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "../../categoria/CategoryForm";

interface ModalUpdateCategoryProps {
    isEditModalOpen: boolean;
    setIsEditModalOpen: (open: boolean) => void;
    handleSubmitEdit: (e: React.FormEvent) => void;
    editForm: any;
}

export function ModalUpdateCategory({ isEditModalOpen, setIsEditModalOpen, handleSubmitEdit, editForm }: ModalUpdateCategoryProps) {
    return (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Categoria</DialogTitle>
                    <DialogDescription>Edite a categoria.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitEdit} className="space-y-4 py-4">
                    <CategoryForm register={editForm.register} />
                </form>
                <DialogFooter>
                    <Button type="submit">Salvar</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}