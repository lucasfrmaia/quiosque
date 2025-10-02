import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormProvider } from "react-hook-form"
import { ProdutoForm } from "../../forms/ProdutoForm"

interface ModalUpdateProductProps {
  isEditModalOpen: boolean;
  editForm: any;
  categories: any[];
  setIsEditModalOpen: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function ModalUpdateProduct({ isEditModalOpen, setIsEditModalOpen, editForm, onSubmit, categories }: ModalUpdateProductProps) {
 
  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <FormProvider {...editForm}>
          <form onSubmit={editForm.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>Edite o produto.</DialogDescription>
            </DialogHeader>
            <ProdutoForm categories={categories} />
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
