import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FornecedorForm } from "../../forms/FornecedorForm";

interface ModalCreateFornecedorProps {
    isCreateModalOpen: boolean;
    createForm: any;
    setIsCreateModalOpen: (open: boolean) => void;
    handleSubmitCreate: (e: React.FormEvent) => void;
}

export function ModalCreateFornecedor({ isCreateModalOpen, setIsCreateModalOpen, createForm, handleSubmitCreate }: ModalCreateFornecedorProps) {
    return (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmitCreate} className="space-y-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Novo Fornecedor</DialogTitle>
                        <DialogDescription>Crie um novo fornecedor.</DialogDescription>
                    </DialogHeader>
                    <FornecedorForm register={createForm.register} />
                    <DialogFooter>
                        <Button type="submit">Criar</Button>
                        <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

    )
}