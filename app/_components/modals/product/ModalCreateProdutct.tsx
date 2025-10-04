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
import { ProdutoForm } from '../../forms/ProdutoForm';
import { Category } from '@/types/interfaces/entities';

interface ModalCreateProductProps {
  isCreateModalOpen: boolean;
  createForm: any;
  categories: Category[];
  setIsCreateModalOpen: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function ModalCreateProduct({
  isCreateModalOpen,
  setIsCreateModalOpen,
  createForm,
  onSubmit,
  categories,
}: ModalCreateProductProps) {
  return (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <FormProvider {...createForm}>
          <form onSubmit={onSubmit} className="space-y-4 py-4">
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
              <DialogDescription>Crie um novo produto.</DialogDescription>
            </DialogHeader>
            <ProdutoForm categories={categories} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Criar</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
