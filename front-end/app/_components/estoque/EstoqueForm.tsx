import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Produto } from '@/types/interfaces/entities';

export interface EstoqueFormData {
  preco: string;
  quantidade: string;
  dataValidade: string;
  unidade: string;
  produtoId: string;
}

interface EstoqueFormProps {
  produtos: Produto[];
}

export const EstoqueForm: FC<EstoqueFormProps> = ({ produtos }) => {
  const { control } = useFormContext<EstoqueFormData>();

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="produtoId" className="text-right">
          Produto
        </Label>
        <Controller
          control={control}
          name="produtoId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="produtoId" className="col-span-3">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {produtos.map((produto) => (
                  <SelectItem key={produto.id} value={produto.id.toString()}>
                    {produto.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="preco" className="text-right">
          Preço
        </Label>
        <Input
          id="preco"
          type="number"
          {...control.register('preco')}
          className="col-span-3"
          placeholder="Preço unitário"
          step="0.01"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="quantidade" className="text-right">
          Quantidade
        </Label>
        <Input
          id="quantidade"
          type="number"
          {...control.register('quantidade')}
          className="col-span-3"
          placeholder="Quantidade em estoque"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dataValidade" className="text-right">
          Data de Validade
        </Label>
        <Input
          id="dataValidade"
          type="date"
          {...control.register('dataValidade')}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="unidade" className="text-right">
          Unidade
        </Label>
        <Input
          id="unidade"
          type="text"
          {...control.register('unidade')}
          className="col-span-3"
          placeholder="Unidade (ex: Unidade, Kg)"
        />
      </div>

    </div>
  );
};