import { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CategoryFormData {
  name: string;
}

interface CategoryFormProps {
  formData: CategoryFormData;
  onChange: (formData: CategoryFormData) => void;
}

export const CategoryForm: FC<CategoryFormProps> = ({ formData, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...formData, name: e.target.value });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Nome
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Nome da categoria"
        />
      </div>
    </div>
  );
};