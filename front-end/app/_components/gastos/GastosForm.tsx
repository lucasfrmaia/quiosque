import { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GastosFormData {
  produtoId: string;
  quantidade: string;
  precoUnitario: string;
  unidade: string;
  notaFiscalId: string;
}

interface GastosFormProps {
  formData: GastosFormData;
  onChange: (formData: GastosFormData) => void;
}

export const GastosForm: FC<GastosFormProps> = ({ formData, onChange }) => {
  const handleChange = (field: keyof GastosFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="produtoId" className="text-right">
          Produto ID
        </Label>
        <Input
          id="produtoId"
          type="number"
          value={formData.produtoId}
          onChange={handleChange('produtoId')}
          className="col-span-3"
          placeholder="ID do produto"
        />
      </div>
  
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="quantidade" className="text-right">
          Quantidade
        </Label>
        <Input
          id="quantidade"
          type="number"
          value={formData.quantidade}
          onChange={handleChange('quantidade')}
          className="col-span-3"
          placeholder="Quantidade comprada"
        />
      </div>
  
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="precoUnitario" className="text-right">
          Preço Unitário
        </Label>
        <Input
          id="precoUnitario"
          type="number"
          value={formData.precoUnitario}
          onChange={handleChange('precoUnitario')}
          className="col-span-3"
          placeholder="Preço unitário"
          step="0.01"
        />
      </div>
  
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notaFiscalId" className="text-right">
          Nota Fiscal ID
        </Label>
        <Input
          id="notaFiscalId"
          type="number"
          value={formData.notaFiscalId}
          onChange={handleChange('notaFiscalId')}
          className="col-span-3"
          placeholder="ID da nota fiscal"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="unidade" className="text-right">
          Unidade
        </Label>
        <Input
          id="unidade"
          type="text"
          value={formData.unidade}
          onChange={handleChange('unidade')}
          className="col-span-3"
          placeholder="Unidade (ex: Unidade)"
        />
      </div>
    </div>
  );
};