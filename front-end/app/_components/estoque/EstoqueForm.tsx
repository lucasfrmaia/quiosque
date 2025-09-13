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

interface EstoqueFormData {
  preco: string;
  quantidade: string;
  dataValidade: string;
  unidade: string;
  produtoId: string;
  estoqueId: string;
  tipo: string;
}

interface EstoqueFormProps {
  formData: EstoqueFormData;
  onChange: (formData: EstoqueFormData) => void;
  produtos: Produto[];
}

export const EstoqueForm: FC<EstoqueFormProps> = ({ formData, onChange, produtos }) => {
  const handleInputChange = (field: keyof EstoqueFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...formData, [field]: e.target.value });
  };

  const handleSelectChange = (field: keyof EstoqueFormData) => (value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="produtoId" className="text-right">
          Produto
        </Label>
        <Select value={formData.produtoId} onValueChange={handleSelectChange('produtoId')}>
          <SelectTrigger id="produtoId" className="col-span-3">
            <SelectValue placeholder="Selecione um produto" />
          </SelectTrigger>
          <SelectContent>
            {produtos.map((produto) => (
              <SelectItem key={produto.id} value={produto.id.toString()}>
                {produto.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="estoqueId" className="text-right">
          Estoque ID
        </Label>
        <Input
          id="estoqueId"
          type="number"
          value={formData.estoqueId}
          onChange={handleInputChange('estoqueId')}
          className="col-span-3"
          placeholder="ID do estoque"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="preco" className="text-right">
          Preço
        </Label>
        <Input
          id="preco"
          type="number"
          value={formData.preco}
          onChange={handleInputChange('preco')}
          className="col-span-3"
          placeholder="Preço unitário"
          step="0.01"
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
          onChange={handleInputChange('quantidade')}
          className="col-span-3"
          placeholder="Quantidade em estoque"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dataValidade" className="text-right">
          Data de Validade
        </Label>
        <Input
          id="dataValidade"
          type="date"
          value={formData.dataValidade}
          onChange={handleInputChange('dataValidade')}
          className="col-span-3"
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
          onChange={handleInputChange('unidade')}
          className="col-span-3"
          placeholder="Unidade (ex: Unidade, Kg)"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tipo" className="text-right">
          Tipo
        </Label>
        <Select value={formData.tipo} onValueChange={handleSelectChange('tipo')}>
          <SelectTrigger id="tipo" className="col-span-3">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Insumo">Insumo</SelectItem>
            <SelectItem value="Produto">Produto</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};