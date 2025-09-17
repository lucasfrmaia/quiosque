import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { NotaFiscalVenda, ProdutoVenda } from '@/types/interfaces/entities';

export interface NotaFiscalVendaFormData {
  data: string;
  total: string;
  produtos: Array<{
    produtoId: string;
    quantidade: string;
    unidade: string;
    precoUnitario: string;
  }>;
}

interface NotaFiscalVendaFormProps {
  editing?: boolean;
}

export const NotaFiscalVendaForm: FC<NotaFiscalVendaFormProps> = ({ editing = false }) => {
  const { register } = useFormContext<NotaFiscalVendaFormData>();
  const { fields, append, remove } = useFieldArray({
    control: useFormContext().control,
    name: "produtos"
  });

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="data" className="text-right">
          Data
        </Label>
        <Input
          id="data"
          type="date"
          {...register('data')}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="total" className="text-right">
          Total
        </Label>
        <Input
          id="total"
          type="number"
          {...register('total')}
          className="col-span-3"
          placeholder="Total da nota fiscal"
          step="0.01"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Produtos</Label>
        <Button 
          type="button" 
          onClick={() => append({ produtoId: '', quantidade: '', unidade: '', precoUnitario: '' })} 
          className="mt-2"
        >
          Adicionar Produto
        </Button>
        {fields.map((field, index) => (
          <div key={field.id} className="border p-4 mt-4 rounded">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Produto ID</Label>
              <Input
                {...register(`produtos.${index}.produtoId` as const)}
                placeholder="ID do produto"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <Label className="text-right">Quantidade</Label>
              <Input
                type="number"
                {...register(`produtos.${index}.quantidade` as const)}
                placeholder="Quantidade"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <Label className="text-right">Unidade</Label>
              <Input
                {...register(`produtos.${index}.unidade` as const)}
                placeholder="Unidade"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <Label className="text-right">Preço Unitário</Label>
              <Input
                type="number"
                {...register(`produtos.${index}.precoUnitario` as const)}
                placeholder="Preço unitário"
                className="col-span-3"
                step="0.01"
              />
            </div>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => remove(index)} 
              className="mt-2"
            >
              Remover Produto
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};