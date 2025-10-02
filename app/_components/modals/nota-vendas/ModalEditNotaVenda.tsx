import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { NotaFiscalVendaForm } from "../../forms/NotaFiscalVendaForm";

interface ModalEditNotaVendaProps {
    isEditModalOpen: boolean;
    setIsEditModalOpen: (open: boolean) => void;
    editForm: any; // Substitua 'any' pelo tipo correto do seu formulário
    onSubmit: (data: any) => void;
}

export function ModalEditNotaVenda({ isEditModalOpen, setIsEditModalOpen, editForm, onSubmit }: ModalEditNotaVendaProps) {
    return (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-2xl">
                <FormProvider {...editForm}>
                    <form onSubmit={editForm.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <DialogHeader>
                            <DialogTitle>Editar Nota Fiscal de Venda</DialogTitle>
                            <DialogDescription>Edite a nota fiscal de venda.</DialogDescription>
                        </DialogHeader>
                        <NotaFiscalVendaForm />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                            <Button type="submit">Salvar</Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}