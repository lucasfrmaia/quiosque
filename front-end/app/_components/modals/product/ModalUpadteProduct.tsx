import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormProvider } from "react-hook-form"
import { ProdutoForm } from "../../forms/ProdutoForm"

interface ModalUpdateProductProps {
  isEditModalOpen: boolean;
  editForm: any;
  categories: any[];
  setIsEditModalOpen: (open: boolean) => void;
  handleSubmitEdit: (e: React.BaseSyntheticEvent) => Promise<void>;
}

export function ModalUpdateProduct({ isEditModalOpen, setIsEditModalOpen, editForm, handleSubmitEdit, categories }: ModalUpdateProductProps) {

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmitEdit} className="space-y-4 py-4">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>Edite o produto.</DialogDescription>
          </DialogHeader>
          <FormProvider {...editForm}>
            <ProdutoForm categories={categories} editing={true} />
          </FormProvider>
          <DialogFooter>
            <Button type="submit">Salvar</Button>
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

}
