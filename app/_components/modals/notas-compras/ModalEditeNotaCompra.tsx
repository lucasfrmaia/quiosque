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

interface ModalEditNotaCompraProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  editForm: any; // Substitua 'any' pelo tipo correto do seu formulário
  onSubmit: (data: any) => void;
  fornecedores: Fornecedor[]; // Ajuste o tipo conforme necessário
}

export function ModalEditNotaCompra({
  isEditModalOpen,
  setIsEditModalOpen,
  editForm,
  onSubmit,
  fornecedores,
}: ModalEditNotaCompraProps) {
  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="sm:max-w-2xl">
        <FormProvider {...editForm}>
          <form onSubmit={editForm.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <DialogHeader>
              <DialogTitle>Editar Nota Fiscal de Compra</DialogTitle>
              <DialogDescription>Edite a nota fiscal de compra.</DialogDescription>
            </DialogHeader>
            <NotaFiscalCompraForm fornecedores={fornecedores} />
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
