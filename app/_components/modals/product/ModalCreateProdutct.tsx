import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { ProdutoForm, ProdutoFormData } from "../../forms/ProdutoForm";
import { Category } from "@/types/interfaces/entities";

interface ModalCreateProductProps {
    isCreateModalOpen: boolean;
    createForm: UseFormReturn<ProdutoFormData, any, ProdutoFormData>;
    categories: Category[];
    setIsCreateModalOpen: (open: boolean) => void;
    handleSubmitCreate: (e: React.BaseSyntheticEvent) => Promise<void>;
}

export function ModalCreateProduct({ isCreateModalOpen, setIsCreateModalOpen, createForm, handleSubmitCreate, categories }: ModalCreateProductProps) {
    return (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmitCreate} className="space-y-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Novo Produto</DialogTitle>
                        <DialogDescription>Crie um novo produto.</DialogDescription>
                    </DialogHeader>
                    <FormProvider {...createForm}>
                        <ProdutoForm categories={categories} />
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