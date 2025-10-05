import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { CategorySchema } from '@/types/validation';

export const CategoryForm: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CategorySchema>();

  return (
    <div className="">
      <Label htmlFor="name" className="text-right">
        Nome
      </Label>
      <div className="col-span-3 space-y-1">
        <Input
          id="name"
          {...register('name')}
          className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
          placeholder="Nome da categoria"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="mt-4">
        <Label>Descrição (Opcional)</Label>
        <Input
          id="description"
          {...register('description')}
          placeholder="Digite uma descrição...."
          className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="mt-4">
        <Label>Cor (Opcional)</Label>
        <Input
          id="description"
          {...register('color')}
          type="color"
          placeholder="Digite uma cor...."
          className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
        />
        {errors.color && <p className="text-sm text-red-500">{errors.color.message}</p>}
      </div>
    </div>
  );
};
