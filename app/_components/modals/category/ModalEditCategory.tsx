import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormProvider } from 'react-hook-form';
import { CategoryForm } from '../../forms/CategoryForm';

interface ModalUpdateCategoryProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  editForm: any;
  onSubmit: (data: any) => void;
}

export function ModalUpdateCategory({
  isEditModalOpen,
  setIsEditModalOpen,
  editForm,
  onSubmit,
}: ModalUpdateCategoryProps) {
  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <FormProvider {...editForm}>
          <form onSubmit={editForm.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <DialogHeader>
              <DialogTitle>Editar Categoria</DialogTitle>
              <DialogDescription>Edite a categoria.</DialogDescription>
            </DialogHeader>
            <CategoryForm />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
