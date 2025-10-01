import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { NotaFiscalVendaForm } from "../../forms/NotaFiscalVendaForm";

interface ModalEditNotaVendaProps {
    isEditModalOpen: boolean;
    setIsEditModalOpen: (open: boolean) => void;
    editForm: any; // Substitua 'any' pelo tipo correto do seu formulário
    handleSubmitEdit: (e: React.FormEvent) => void;
}

export function ModalEditNotaVenda({ isEditModalOpen, setIsEditModalOpen, editForm, handleSubmitEdit }: ModalEditNotaVendaProps) {
    return (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-2xl">
                <form onSubmit={handleSubmitEdit} className="space-y-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Editar Nota Fiscal de Venda</DialogTitle>
                        <DialogDescription>Edite a nota fiscal de venda.</DialogDescription>
                    </DialogHeader>
                    <FormProvider {...editForm}>
                        <NotaFiscalVendaForm editing={true} />
                    </FormProvider>
                    <DialogFooter>
                        <Button type="submit">Salvar</Button>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}