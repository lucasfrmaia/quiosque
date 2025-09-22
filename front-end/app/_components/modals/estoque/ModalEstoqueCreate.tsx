import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { EstoqueForm } from "../../estoque/EstoqueForm";
import { Produto } from "@/types/interfaces/entities";

interface ModalEstoqueCreateProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (open: boolean) => void;
    handleSubmitCreate: (e: React.FormEvent) => void;
    createForm: any;
    produtos: Produto[];
}

export function ModalEstoqueCreate({ isCreateModalOpen, setIsCreateModalOpen, handleSubmitCreate, createForm, produtos }: ModalEstoqueCreateProps) {
    return (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmitCreate} className="space-y-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Novo Item de Estoque</DialogTitle>
                        <DialogDescription>Crie um novo item de estoque.</DialogDescription>
                    </DialogHeader>
                    <FormProvider {...createForm}>
                        <EstoqueForm produtos={produtos} />
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