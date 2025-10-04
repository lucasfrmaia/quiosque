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
import { FornecedorForm } from '../../forms/FornecedorForm';

interface ModalEditFornecedorProps {
  isEditModalOpen: boolean;
  editForm: any;
  setIsEditModalOpen: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function ModalEditFornecedor({
  isEditModalOpen,
  setIsEditModalOpen,
  editForm,
  onSubmit,
}: ModalEditFornecedorProps) {
  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <FormProvider {...editForm}>
          <form onSubmit={editForm.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <DialogHeader>
              <DialogTitle>Editar Fornecedor</DialogTitle>
              <DialogDescription>Edite o fornecedor.</DialogDescription>
            </DialogHeader>
            <FornecedorForm />
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
