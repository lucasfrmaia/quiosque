import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { NotaFiscalCompraForm } from "../../nota-fiscal-compra/NotaFiscalCompraForm";
import { Fornecedor } from "@/types/interfaces/entities";

interface ModalCreateNotaCompraProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (open: boolean) => void;
    createForm: any;
    handleSubmitCreate: (e: any) => void;
    fornecedores: Fornecedor[];
}

export function ModalCreateNotaCompra({ isCreateModalOpen, setIsCreateModalOpen, createForm, handleSubmitCreate, fornecedores }: ModalCreateNotaCompraProps) {
    return (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Nova Nota Fiscal de Compra</DialogTitle>
                    <DialogDescription>Crie uma nova nota fiscal de compra.</DialogDescription>
                </DialogHeader>
                <FormProvider {...createForm}>
                    <form onSubmit={handleSubmitCreate} className="space-y-4 py-4">
                        <NotaFiscalCompraForm fornecedores={fornecedores} />
                    </form>
                </FormProvider>
                <DialogFooter>
                    <Button type="submit">Criar</Button>
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}