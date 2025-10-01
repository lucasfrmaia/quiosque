import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { NotaFiscalVendaForm } from "../../forms/NotaFiscalVendaForm";

interface ModalCreateNotaVendaProps {
    isCreateModalOpen: boolean;
    createForm: any;
    setIsCreateModalOpen: (open: boolean) => void;
    handleSubmitCreate: (e: any) => void;
}

export function ModalCreateNotaVenda({ isCreateModalOpen, createForm, setIsCreateModalOpen, handleSubmitCreate }: ModalCreateNotaVendaProps) {
    return (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-2xl">
                <form onSubmit={handleSubmitCreate} className="space-y-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Nova Nota Fiscal de Venda</DialogTitle>
                        <DialogDescription>Crie uma nova nota fiscal de venda.</DialogDescription>
                    </DialogHeader>
                    <FormProvider {...createForm}>
                        <NotaFiscalVendaForm />
                    </FormProvider>
                    <DialogFooter>
                        <Button type="submit">Criar</Button>
                        <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}