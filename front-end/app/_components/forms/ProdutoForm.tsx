import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Controller, useFormContext as UseFormContextType } from 'react-hook-form';
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
import { ProdutoSchema } from '@/types/validation';

interface ProdutoFormProps {
  categories: Category[];
  editing?: boolean;
}

export const ProdutoForm: FC<ProdutoFormProps> = ({ categories, editing = false }) => {
  const { control } = useFormContext<ProdutoSchema>();

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nome" className="text-right">
          Nome
        </Label>
        <Input
          id="nome"
          {...control.register('nome')}
          className="col-span-3"
          placeholder="Nome do produto"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="descricao" className="text-right">
          Descrição
        </Label>
        <Input
          id="descricao"
          {...control.register('descricao')}
          className="col-span-3"
          placeholder="Descrição do produto (opcional)"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="imagemUrl" className="text-right">
          Imagem URL
        </Label>
        <Input
          id="imagemUrl"
          {...control.register('imagemUrl')}
          className="col-span-3"
          placeholder="URL da imagem (opcional)"
        />
      </div>
  
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="categoriaId" className="text-right">
          Categoria
        </Label>
        <Controller
          control={control}
          name="categoriaId"
          render={({ field }) => (
            <Select value={String(field.value)} onValueChange={field.onChange}>
              <SelectTrigger id="categoriaId" className="col-span-3">
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
      </div>
  
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="ativo" className="text-right">
          Ativo
        </Label>
        <Controller
          control={control}
          name="ativo"
          render={({ field }) => (
            <Select value={String(field.value)} onValueChange={field.onChange}>
              <SelectTrigger id="ativo" className="col-span-3">
                <SelectValue placeholder="Selecione se está ativo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
  
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tipo" className="text-right">
          Tipo
        </Label>
        <Controller
          control={control}
          name="tipo"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(value) => field.onChange(value as 'INSUMO' | 'CARDAPIO')}>
              <SelectTrigger id="tipo" className="col-span-3">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INSUMO">Insumo</SelectItem>
                <SelectItem value="CARDAPIO">Cardápio</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
};