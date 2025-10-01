import { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { CategorySchema } from '@/types/validation';

interface CategoryFormProps {
  register: UseFormRegister<CategorySchema>;
}

export const CategoryForm: FC<CategoryFormProps> = ({ register }) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Nome
        </Label>
        <Input
          id="name"
          {...register('name')}
          className="col-span-3"
          placeholder="Nome da categoria"
        />
      </div>
    </div>
  );
};