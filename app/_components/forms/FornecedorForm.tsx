import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { fornecedorSchema } from '@/types/validation';

type FornecedorFormData = z.infer<typeof fornecedorSchema>;

export const FornecedorForm: FC = () => {
  const { register, formState: { errors } } = useFormContext<FornecedorFormData>();

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
            placeholder="Nome do fornecedor"
          />
          {errors.nome && (
            <p className="text-sm text-red-500">{errors.nome.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cnpj" className="text-right">
          CNPJ
        </Label>
        <div className="col-span-3 space-y-1">
          <Input
            id="cnpj"
            {...register('cnpj')}
            className={errors.cnpj ? 'border-red-500 focus:border-red-500' : ''}
            placeholder="CNPJ (opcional)"
          />
          {errors.cnpj && (
            <p className="text-sm text-red-500">{errors.cnpj.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="telefone" className="text-right">
          Telefone
        </Label>
        <div className="col-span-3 space-y-1">
          <Input
            id="telefone"
            {...register('telefone')}
            className={errors.telefone ? 'border-red-500 focus:border-red-500' : ''}
            placeholder="Telefone (opcional)"
          />
          {errors.telefone && (
            <p className="text-sm text-red-500">{errors.telefone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <div className="col-span-3 space-y-1">
          <Input
            id="email"
            {...register('email')}
            className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
            placeholder="Email (opcional)"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};