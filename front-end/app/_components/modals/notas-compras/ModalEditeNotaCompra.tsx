import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { NotaFiscalCompraForm } from "../../nota-fiscal-compra/NotaFiscalCompraForm";
import { Fornecedor } from "@/types/interfaces/entities";

interface ModalEditNotaCompraProps {
    isEditModalOpen: boolean;
    setIsEditModalOpen: (open: boolean) => void;
    editForm: any; // Substitua 'any' pelo tipo correto do seu formulário
    handleSubmitEdit: (e: React.FormEvent) => void;
    fornecedores: Fornecedor[]; // Ajuste o tipo conforme necessário          
}

export function ModalEditNotaCompra({ isEditModalOpen, setIsEditModalOpen, editForm, handleSubmitEdit, fornecedores }: ModalEditNotaCompraProps) {
    return (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-2xl">
                <form onSubmit={handleSubmitEdit} className="space-y-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Editar Nota Fiscal de Compra</DialogTitle>
                        <DialogDescription>Edite a nota fiscal de compra.</DialogDescription>
                    </DialogHeader>
                    <FormProvider {...editForm}>
                        <NotaFiscalCompraForm fornecedores={fornecedores} editing={true} />
                    </FormProvider>
                    <DialogFooter>
                        <Button type="submit">Salvar</Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}