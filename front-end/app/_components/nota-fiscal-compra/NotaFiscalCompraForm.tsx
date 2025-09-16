import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Fornecedor, NotaFiscalCompra, ProdutoCompra } from '@/types/interfaces/entities';

interface NotaFiscalCompraFormData {
  data: string;
  fornecedorId: string;
  total: string;
  produtos: Array<{
    produtoId: string;
    quantidade: string;
    unidade: string;
    precoUnitario: string;
  }>;
}

interface NotaFiscalCompraFormProps {
  formData: NotaFiscalCompraFormData;
  onChange: (formData: NotaFiscalCompraFormData) => void;
  fornecedores: Fornecedor[];
  editing?: boolean;
}

export const NotaFiscalCompraForm: FC<NotaFiscalCompraFormProps> = ({ formData, onChange, fornecedores, editing = false }) => {
  const handleInputChange = (field: keyof NotaFiscalCompraFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...formData, [field]: e.target.value });
  };

  const handleFornecedorChange = (value: string) => {
    onChange({ ...formData, fornecedorId: value });
  };

  const addProduto = () => {
    const newProduto = {
      produtoId: '',
      quantidade: '',
      unidade: '',
      precoUnitario: '',
    };
    onChange({ ...formData, produtos: [...formData.produtos, newProduto] });
  };

  const removeProduto = (index: number) => {
    const updatedProdutos = formData.produtos.filter((_, i) => i !== index);
    onChange({ ...formData, produtos: updatedProdutos });
  };

  const updateProduto = (index: number, field: string, value: string) => {
    const updatedProdutos = formData.produtos.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    );
    onChange({ ...formData, produtos: updatedProdutos });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="data" className="text-right">
          Data
        </Label>
        <Input
          id="data"
          type="date"
          value={formData.data}
          onChange={handleInputChange('data')}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fornecedorId" className="text-right">
          Fornecedor
        </Label>
        <Select value={formData.fornecedorId} onValueChange={handleFornecedorChange}>
          <SelectTrigger id="fornecedorId" className="col-span-3">
            <SelectValue placeholder="Selecione um fornecedor" />
          </SelectTrigger>
          <SelectContent>
            {fornecedores.map((fornecedor) => (
              <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                {fornecedor.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="total" className="text-right">
          Total
        </Label>
        <Input
          id="total"
          type="number"
          value={formData.total}
          onChange={handleInputChange('total')}
          className="col-span-3"
          placeholder="Total da nota fiscal"
          step="0.01"
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Produtos</Label>
        <Button onClick={addProduto} className="mt-2">Adicionar Produto</Button>
        {formData.produtos.map((produto, index) => (
          <div key={index} className="border p-4 mt-4 rounded">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Produto ID</Label>
              <Input
                value={produto.produtoId}
                onChange={(e) => updateProduto(index, 'produtoId', e.target.value)}
                placeholder="ID do produto"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <Label className="text-right">Quantidade</Label>
              <Input
                type="number"
                value={produto.quantidade}
                onChange={(e) => updateProduto(index, 'quantidade', e.target.value)}
                placeholder="Quantidade"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <Label className="text-right">Unidade</Label>
              <Input
                value={produto.unidade}
                onChange={(e) => updateProduto(index, 'unidade', e.target.value)}
                placeholder="Unidade"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <Label className="text-right">Preço Unitário</Label>
              <Input
                type="number"
                value={produto.precoUnitario}
                onChange={(e) => updateProduto(index, 'precoUnitario', e.target.value)}
                placeholder="Preço unitário"
                className="col-span-3"
                step="0.01"
              />
            </div>
            <Button variant="destructive" onClick={() => removeProduto(index)} className="mt-2">
              Remover Produto
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};