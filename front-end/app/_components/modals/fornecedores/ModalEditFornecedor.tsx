import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FornecedorForm } from "../../fornecedor/FornecedorForm";

interface ModalEditFornecedorProps {
    isEditModalOpen: boolean;
    editForm: any;
    setIsEditModalOpen: (open: boolean) => void;
    handleSubmitEdit: (e: React.FormEvent) => void;
}

export function ModalEditFornecedor({ isEditModalOpen, setIsEditModalOpen, editForm, handleSubmitEdit }: ModalEditFornecedorProps) {
    return (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Fornecedor</DialogTitle>
                    <DialogDescription>Edite o fornecedor.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitEdit} className="space-y-4 py-4">
                    <FornecedorForm register={editForm.register} editing={true} />
                </form>
                <DialogFooter>
                    <Button type="submit">Salvar</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}