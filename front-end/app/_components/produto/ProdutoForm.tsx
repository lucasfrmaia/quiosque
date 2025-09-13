import { FC } from 'react';
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

interface ProdutoFormData {
  nome: string;
  categoriaId: string;
}

interface ProdutoFormProps {
  formData: ProdutoFormData;
  onChange: (formData: ProdutoFormData) => void;
  categories: Category[];
  editing?: boolean;
}

export const ProdutoForm: FC<ProdutoFormProps> = ({ formData, onChange, categories, editing = false }) => {
  const handleInputChange = (field: keyof ProdutoFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...formData, [field]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    onChange({ ...formData, categoriaId: value });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nome" className="text-right">
          Nome
        </Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={handleInputChange('nome')}
          className="col-span-3"
          placeholder="Nome do produto"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="categoriaId" className="text-right">
          Categoria
        </Label>
        <Select value={formData.categoriaId} onValueChange={handleSelectChange}>
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
      </div>
    </div>
  );
};