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
import { EstoqueForm } from '../../forms/EstoqueForm';
import { Produto } from '@/types/interfaces/entities';

interface ModalEditEstoqueProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  editForm: any;
  onSubmit: (data: any) => void;
  produtos: Produto[];
}

export function ModalEditEstoque({
  isEditModalOpen,
  setIsEditModalOpen,
  onSubmit,
  editForm,
  produtos,
}: ModalEditEstoqueProps) {
  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <FormProvider {...editForm}>
          <form onSubmit={editForm.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <DialogHeader>
              <DialogTitle>Editar Item de Estoque</DialogTitle>
              <DialogDescription>Edite o item de estoque.</DialogDescription>
            </DialogHeader>
            <EstoqueForm produtos={produtos} />
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
