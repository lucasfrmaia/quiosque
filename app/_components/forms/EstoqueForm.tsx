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
import { EstoqueSchema } from '@/types/validation';
import { SelectTipoUnidade } from '../common/SelectTipoUnidade';

interface EstoqueFormProps {
  produtos: Produto[];
}

export const EstoqueForm: FC<EstoqueFormProps> = ({ produtos }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<EstoqueSchema>();

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
              <Select
                value={String(field.value)}
                onValueChange={(val) => field.onChange(Number(val))}
              >
                <SelectTrigger
                  id="produtoId"
                  className={errors.produtoId ? 'border-red-500 focus:border-red-500' : ''}
                >
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
          {errors.produtoId && <p className="text-sm text-red-500">{errors.produtoId.message}</p>}
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
            step="0.01"
            {...register('preco', { valueAsNumber: true })}
            className={errors.preco ? 'border-red-500 focus:border-red-500' : ''}
            placeholder="Preço unitário"
          />
          {errors.preco && <p className="text-sm text-red-500">{errors.preco.message}</p>}
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
            step="0.01"
            {...register('quantidade', { valueAsNumber: true })}
            className={errors.quantidade ? 'border-red-500 focus:border-red-500' : ''}
            placeholder="Quantidade em estoque"
          />
          {errors.quantidade && <p className="text-sm text-red-500">{errors.quantidade.message}</p>}
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
            {...register('dataValidade', { valueAsDate: true })}
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
          <SelectTipoUnidade control={control} />
        </div>
      </div>
    </div>
  );
};
