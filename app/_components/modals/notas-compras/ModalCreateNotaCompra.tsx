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
import { NotaFiscalCompraForm } from '../../forms/NotaFiscalCompraForm';
import { Fornecedor } from '@/types/interfaces/entities';

interface ModalCreateNotaCompraProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  createForm: any;
  onSubmit: (data: any) => void;
  fornecedores: Fornecedor[];
}

export function ModalCreateNotaCompra({
  isCreateModalOpen,
  setIsCreateModalOpen,
  createForm,
  onSubmit,
  fornecedores,
}: ModalCreateNotaCompraProps) {
  return (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="sm:max-w-2xl">
        <FormProvider {...createForm}>
          <form onSubmit={createForm.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <DialogHeader>
              <DialogTitle>Nova Nota Fiscal de Compra</DialogTitle>
              <DialogDescription>Crie uma nova nota fiscal de compra.</DialogDescription>
            </DialogHeader>
            <NotaFiscalCompraForm fornecedores={fornecedores} />
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
