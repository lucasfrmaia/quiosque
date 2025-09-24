import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Controller, useFormContext } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useProduto } from '../hooks/useProduto';
import { Fornecedor, NotaFiscalCompra, ProdutoCompra, Produto } from '@/types/interfaces/entities';
import { NotaFiscalCompraSchema } from '@/types/validation';

interface NotaFiscalCompraFormData {
  data: string;
  fornecedorId: string;
  produtos: Array<{
    produtoId: string;
    quantidade: string;
    unidade: string;
    precoUnitario: string;
  }>;
}

interface NotaFiscalCompraFormProps {
  fornecedores: Fornecedor[];
  editing?: boolean;
}

export const NotaFiscalCompraForm: FC<NotaFiscalCompraFormProps> = ({ fornecedores, editing = false }) => {
  const { control, register } = useFormContext<NotaFiscalCompraSchema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "produtos"
  });

  const { allProdutosQuery: { data: produtos = [] } } = useProduto();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProdutoId, setSelectedProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');

  const filteredProdutos = produtos.filter((p: Produto) =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduto = () => {
    if (!selectedProdutoId || !quantidade || !precoUnitario) return;

    const produto = produtos.find((p: Produto) => p.id.toString() === selectedProdutoId);
    if (!produto) return;

    append({
      produtoId: selectedProdutoId,
      quantidade,
      unidade: 'Unidade', // Default since not in Produto
      precoUnitario
    });

    setSelectedProdutoId('');
    setQuantidade('');
    setPrecoUnitario('');
    setSearchTerm('');
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
          {...register('data')}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fornecedorId" className="text-right">
          Fornecedor
        </Label>
        <Controller
          control={control}
          name="fornecedorId"
          render={({ field }) => (
            <Select value={String(field.value)} onValueChange={field.onChange}>
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
          )}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Adicionar Produto</Label>
        <div className="grid grid-cols-4 items-center gap-4 mt-2">
          <Label className="text-right">Produto</Label>
          <div className="col-span-3 space-y-2">
            <Input
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedProdutoId} onValueChange={setSelectedProdutoId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {filteredProdutos.map((produto: Produto) => (
                  <SelectItem key={produto.id} value={produto.id.toString()}>
                    {produto.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4 mt-2">
          <Label className="text-right">Quantidade</Label>
          <Input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Quantidade"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4 mt-2">
          <Label className="text-right">Preço Unitário</Label>
          <Input
            type="number"
            value={precoUnitario}
            onChange={(e) => setPrecoUnitario(e.target.value)}
            placeholder="Preço unitário"
            className="col-span-3"
            step="0.01"
          />
        </div>
        <Button
          type="button"
          onClick={handleAddProduto}
          className="mt-2"
        >
          Adicionar Produto
        </Button>
      </div>

      {fields.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Produtos Adicionados</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {fields.map((field, index) => {
              const produto = produtos.find((p: Produto) => p.id.toString() === field.produtoId);
              return (
                <div key={field.id} className="flex items-center">
                  <Badge variant="secondary" className="mr-1">
                    {produto?.nome || 'Produto desconhecido'} - Qtd: {field.quantidade} - Preço: R$ {parseFloat(field.precoUnitario || '0').toFixed(2)}
                  </Badge>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    ×
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};