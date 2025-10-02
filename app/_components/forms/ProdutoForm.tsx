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
import { Category } from '@/types/interfaces/entities';
import { z } from 'zod';
import { produtoSchema } from '@/types/validation';

type ProdutoFormData = z.infer<typeof produtoSchema>;

interface ProdutoFormProps {
  categories: Category[];
  editing?: boolean;
}

export const ProdutoForm: FC<ProdutoFormProps> = ({ categories, editing = false }) => {
  const { control, register, formState: { errors } } = useFormContext<ProdutoFormData>();

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nome" className="text-right">
          Nome
        </Label>
        <div className="col-span-3 space-y-1">
          <Input
            id="nome"
            {...register('nome')}
            className={errors.nome ? 'border-red-500 focus:border-red-500' : ''}
            placeholder="Nome do produto"
          />
          {errors.nome && (
            <p className="text-sm text-red-500">{errors.nome.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="descricao" className="text-right">
          Descrição
        </Label>
        <div className="col-span-3 space-y-1">
          <Input
            id="descricao"
            {...register('descricao')}
            className={errors.descricao ? 'border-red-500 focus:border-red-500' : ''}
            placeholder="Descrição do produto (opcional)"
          />
          {errors.descricao && (
            <p className="text-sm text-red-500">{errors.descricao.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="imagemUrl" className="text-right">
          Imagem URL
        </Label>
        <div className="col-span-3 space-y-1">
          <Input
            id="imagemUrl"
            {...register('imagemUrl')}
            className={errors.imagemUrl ? 'border-red-500 focus:border-red-500' : ''}
            placeholder="URL da imagem (opcional)"
          />
          {errors.imagemUrl && (
            <p className="text-sm text-red-500">{errors.imagemUrl.message}</p>
          )}
        </div>
      </div>
   
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="categoriaId" className="text-right">
          Categoria
        </Label>
        <div className="col-span-3 space-y-1">
          <Controller
            control={control}
            name="categoriaId"
            render={({ field }) => (
              <Select value={String(field.value || '')} onValueChange={field.onChange}>
                <SelectTrigger id="categoriaId" className={errors.categoriaId ? 'border-red-500 focus:border-red-500' : ''}>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoriaId && (
            <p className="text-sm text-red-500">{errors.categoriaId.message}</p>
          )}
        </div>
      </div>
   
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="ativo" className="text-right">
          Ativo
        </Label>
        <div className="col-span-3 space-y-1">
          <Controller
            control={control}
            name="ativo"
            render={({ field }) => (
              <Select value={String(field.value)} onValueChange={(value) => field.onChange(value === 'true')}>
                <SelectTrigger id="ativo" className={errors.ativo ? 'border-red-500 focus:border-red-500' : ''}>
                  <SelectValue placeholder="Selecione se está ativo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.ativo && (
            <p className="text-sm text-red-500">{errors.ativo.message}</p>
          )}
        </div>
      </div>
   
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tipo" className="text-right">
          Tipo
        </Label>
        <div className="col-span-3 space-y-1">
          <Controller
            control={control}
            name="tipo"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="tipo" className={errors.tipo ? 'border-red-500 focus:border-red-500' : ''}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INSUMO">Insumo</SelectItem>
                  <SelectItem value="CARDAPIO">Cardápio</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.tipo && (
            <p className="text-sm text-red-500">{errors.tipo.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};