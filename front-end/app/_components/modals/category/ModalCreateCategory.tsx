import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryForm } from "../../forms/CategoryForm";

interface ModalCreateCategoryProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (open: boolean) => void;
    handleSubmitCreate: (e: React.FormEvent) => void;
    createForm: any;
}

export function ModalCreateCategory({ isCreateModalOpen, setIsCreateModalOpen, handleSubmitCreate, createForm }: ModalCreateCategoryProps) {

    return (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmitCreate} className="space-y-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Nova Categoria</DialogTitle>
                        <DialogDescription>Crie uma nova categoria.</DialogDescription>
                    </DialogHeader>
                    <CategoryForm register={createForm.register} />
                    <DialogFooter>
                        <Button type="submit">Criar</Button>
                        <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}