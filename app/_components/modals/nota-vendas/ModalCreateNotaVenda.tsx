import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { NotaFiscalVendaForm } from "../../forms/NotaFiscalVendaForm";

interface ModalCreateNotaVendaProps {
    isCreateModalOpen: boolean;
    createForm: any;
    setIsCreateModalOpen: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

export function ModalCreateNotaVenda({ isCreateModalOpen, createForm, setIsCreateModalOpen, onSubmit }: ModalCreateNotaVendaProps) {
    return (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-2xl">
                <FormProvider {...createForm}>
                    <form onSubmit={createForm.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <DialogHeader>
                            <DialogTitle>Nova Nota Fiscal de Venda</DialogTitle>
                            <DialogDescription>Crie uma nova nota fiscal de venda.</DialogDescription>
                        </DialogHeader>
                        <NotaFiscalVendaForm />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                            <Button type="submit">Criar</Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}