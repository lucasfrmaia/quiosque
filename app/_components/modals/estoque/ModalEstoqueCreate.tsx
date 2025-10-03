import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { EstoqueForm } from "../../forms/EstoqueForm";
import { Produto } from "@/types/interfaces/entities";

interface ModalEstoqueCreateProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  createForm: any;
  onSubmit: (data: any) => void;
  produtos: Produto[];
}

export function ModalEstoqueCreate({
  isCreateModalOpen,
  setIsCreateModalOpen,
  onSubmit,
  createForm,
  produtos,
}: ModalEstoqueCreateProps) {
  return (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <FormProvider {...createForm}>
          <form onSubmit={onSubmit} className="space-y-4 py-4">
            <DialogHeader>
              <DialogTitle>Novo Item de Estoque</DialogTitle>
              <DialogDescription>
                Crie um novo item de estoque.
              </DialogDescription>
            </DialogHeader>

            <EstoqueForm produtos={produtos} />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
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
