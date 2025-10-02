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
import { z } from 'zod';
import { produtoEstoqueSchema } from '@/types/validation';

type EstoqueFormData = z.infer<typeof produtoEstoqueSchema>;

interface EstoqueFormProps {
  produtos: Produto[];
}

export const EstoqueForm: FC<EstoqueFormProps> = ({ produtos }) => {
  const { control, register, formState: { errors } } = useFormContext<EstoqueFormData>();

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="produtoId" className="text-right">
          Produto
        </Label>
        <div className="col-span-3 space-y-1">
          <Controller
            control={control}
            name="produtoId"
            render={({ field }) => (
              <Select value={String(field.value)} onValueChange={field.onChange}>
                <SelectTrigger id="produtoId" className={errors.produtoId ? 'border-red-500 focus:border-red-500' : ''}>
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
          {errors.produtoId && (
            <p className="text-sm text-red-500">{errors.produtoId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="preco" className="text-right">
          Preço
        </Label>
        <div className="col-span-3 space-y-1">
          <Input
            id="preco"
            type="number"
            {...register('preco')}
            className={errors.preco ? 'border-red-500 focus:border-red-500' : ''}
            placeholder="Preço unitário"
            step="0.01"
          />
          {errors.preco && (
            <p className="text-sm text-red-500">{errors.preco.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="quantidade" className="text-right">
          Quantidade
        </Label>
        <div className="col-span-3 space-y-1">
          <Input
            id="quantidade"
            type="number"
            {...register('quantidade')}
            className={errors.quantidade ? 'border-red-500 focus:border-red-500' : ''}
            placeholder="Quantidade em estoque"
          />
          {errors.quantidade && (
            <p className="text-sm text-red-500">{errors.quantidade.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dataValidade" className="text-right">
          Data de Validade
        </Label>
        <div className="col-span-3 space-y-1">
          <Input
            id="dataValidade"
            type="date"
            {...register('dataValidade')}
            className={errors.dataValidade ? 'border-red-500 focus:border-red-500' : ''}
          />
          {errors.dataValidade && (
            <p className="text-sm text-red-500">{errors.dataValidade.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="unidade" className="text-right">
          Unidade
        </Label>
        <div className="col-span-3 space-y-1">
          <Input
            id="unidade"
            type="text"
            {...register('unidade')}
            className={errors.unidade ? 'border-red-500 focus:border-red-500' : ''}
            placeholder="Unidade (ex: Unidade, Kg)"
          />
          {errors.unidade && (
            <p className="text-sm text-red-500">{errors.unidade.message}</p>
          )}
        </div>
      </div>

    </div>
  );
};