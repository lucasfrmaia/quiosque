import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { CategoryForm } from "../../forms/CategoryForm";

interface ModalCreateCategoryProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (open: boolean) => void;
    createForm: any;
    onSubmit: (data: any) => void;
}

export function ModalCreateCategory({ isCreateModalOpen, setIsCreateModalOpen, createForm, onSubmit }: ModalCreateCategoryProps) {

    return (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <FormProvider {...createForm}>
                    <form onSubmit={onSubmit} className="space-y-4 py-4">
                        <DialogHeader>
                            <DialogTitle>Nova Categoria</DialogTitle>
                            <DialogDescription>Crie uma nova categoria.</DialogDescription>
                        </DialogHeader>
                        <CategoryForm />
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