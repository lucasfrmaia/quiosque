import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { EstoqueForm } from "../../estoque/EstoqueForm";
import { Produto } from "@/types/interfaces/entities";

interface ModalEditEstoqueProps {
    isEditModalOpen: boolean;
    setIsEditModalOpen: (open: boolean) => void;
    handleSubmitEdit: (e: React.FormEvent) => void;
    editForm: any;
    produtos: Produto[];
}

export function ModalEditEstoque({ isEditModalOpen, setIsEditModalOpen, handleSubmitEdit, editForm, produtos }: ModalEditEstoqueProps) {
    return (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Item de Estoque</DialogTitle>
                    <DialogDescription>Edite o item de estoque.</DialogDescription>
                </DialogHeader>
                <FormProvider {...editForm}>
                    <form onSubmit={handleSubmitEdit} className="space-y-4 py-4">
                        <EstoqueForm produtos={produtos} />
                    </form>
                </FormProvider>
                <DialogFooter>
                    <Button type="submit">Salvar</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
