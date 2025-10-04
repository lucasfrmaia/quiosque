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
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
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
      </div>
    </div>
  );
};
