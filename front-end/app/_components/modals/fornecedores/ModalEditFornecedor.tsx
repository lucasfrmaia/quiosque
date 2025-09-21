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
                <form onSubmit={handleSubmitEdit} className="space-y-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Editar Fornecedor</DialogTitle>
                        <DialogDescription>Edite o fornecedor.</DialogDescription>
                    </DialogHeader>
                    <FornecedorForm register={editForm.register} editing={true} />
                    <DialogFooter>
                        <Button type="submit">Salvar</Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}