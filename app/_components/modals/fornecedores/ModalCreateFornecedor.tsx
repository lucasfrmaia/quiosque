import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { FornecedorForm } from "../../forms/FornecedorForm";

interface ModalCreateFornecedorProps {
    isCreateModalOpen: boolean;
    createForm: any;
    setIsCreateModalOpen: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

export function ModalCreateFornecedor({ isCreateModalOpen, setIsCreateModalOpen, createForm, onSubmit }: ModalCreateFornecedorProps) {
    return (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <FormProvider {...createForm}>
                    <form onSubmit={createForm.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <DialogHeader>
                            <DialogTitle>Novo Fornecedor</DialogTitle>
                            <DialogDescription>Crie um novo fornecedor.</DialogDescription>
                        </DialogHeader>
                        <FornecedorForm />
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