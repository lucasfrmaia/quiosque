import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { Controller, useFieldArray } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Fornecedor, NotaFiscalCompra, ProdutoCompra } from '@/types/interfaces/entities';

interface NotaFiscalCompraFormData {
  data: string;
  fornecedorId: string;
  total: string;
  produtos: Array<{
    produtoId: string;
    quantidade: string;
    unidade: string;
    precoUnitario: string;
  }>;
}

interface NotaFiscalCompraFormProps {
  fornecedores: Fornecedor[];
  editing?: boolean;
}

export const NotaFiscalCompraForm: FC<NotaFiscalCompraFormProps> = ({ fornecedores, editing = false }) => {
  const { control, register } = useFormContext<NotaFiscalCompraFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
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
        <Label htmlFor="fornecedorId" className="text-right">
          Fornecedor
        </Label>
        <Controller
          control={control}
          name="fornecedorId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="fornecedorId" className="col-span-3">
                <SelectValue placeholder="Selecione um fornecedor" />
              </SelectTrigger>
              <SelectContent>
                {fornecedores.map((fornecedor) => (
                  <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                    {fornecedor.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
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