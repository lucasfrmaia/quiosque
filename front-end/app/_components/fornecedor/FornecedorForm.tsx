import { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister, FieldValues } from 'react-hook-form';

export interface FornecedorFormData {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
}

interface FornecedorFormProps {
  register: UseFormRegister<FornecedorFormData>;
  editing?: boolean;
}

export const FornecedorForm: FC<FornecedorFormProps> = ({ register, editing = false }) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nome" className="text-right">
          Nome
        </Label>
        <Input
          id="nome"
          {...register('nome')}
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
          {...register('cnpj')}
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
          {...register('telefone')}
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
          {...register('email')}
          className="col-span-3"
          placeholder="Email (opcional)"
        />
      </div>
    </div>
  );
};