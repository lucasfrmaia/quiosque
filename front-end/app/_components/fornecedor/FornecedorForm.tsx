import { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FornecedorFormData {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
}

interface FornecedorFormProps {
  formData: FornecedorFormData;
  onChange: (formData: FornecedorFormData) => void;
  editing?: boolean;
}

export const FornecedorForm: FC<FornecedorFormProps> = ({ formData, onChange, editing = false }) => {
  const handleInputChange = (field: keyof FornecedorFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...formData, [field]: e.target.value });
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
          placeholder="Nome do fornecedor"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cnpj" className="text-right">
          CNPJ
        </Label>
        <Input
          id="cnpj"
          value={formData.cnpj}
          onChange={handleInputChange('cnpj')}
          className="col-span-3"
          placeholder="CNPJ (opcional)"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="telefone" className="text-right">
          Telefone
        </Label>
        <Input
          id="telefone"
          value={formData.telefone}
          onChange={handleInputChange('telefone')}
          className="col-span-3"
          placeholder="Telefone (opcional)"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          className="col-span-3"
          placeholder="Email (opcional)"
        />
      </div>
    </div>
  );
};