import { FC, useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchableSelect } from '../common/SearchableSelect';
import { useProduto } from '../hooks/useProduto';
import { Fornecedor, NotaFiscalCompra, ProdutoCompra, Produto } from '@/types/interfaces/entities';
import { z } from 'zod';
import { notaFiscalCompraSchema } from '@/types/validation';
import { Package, X } from 'lucide-react';

type NotaFiscalCompraFormData = z.infer<typeof notaFiscalCompraSchema>;

interface NotaFiscalCompraFormProps {
  fornecedores: Fornecedor[];
  editing?: boolean;
}

export const NotaFiscalCompraForm: FC<NotaFiscalCompraFormProps> = ({ fornecedores, editing = false }) => {
  const { control, register, watch, formState: { errors } } = useFormContext<NotaFiscalCompraFormData>();
  const produtosWatch = watch('produtos') || [];
  const { fields, append, remove } = useFieldArray({
    control,
    name: "produtos"
  });

  const { getAllProdutos } = useProduto()
  const { data: allProdutos = [], isLoading: isLoadingProduto, error: errorProduto } = getAllProdutos()

  const [selectedProduto, setSelectedProduto] = useState<any | null>(null);
  const [quantidade, setQuantidade] = useState(0);
  const [precoUnitario, setPrecoUnitario] = useState(0);
  const produtoOptions = allProdutos.map(p => ({ name: p.nome, ...p }));

  const handleAddProduto = () => {
    if (!selectedProduto || !quantidade || !precoUnitario) return;

    append({
      produtoId: selectedProduto.id,
      quantidade,
      unidade: 'Unidade',
      precoUnitario
    });

    setSelectedProduto(null);
    setQuantidade(0);
    setPrecoUnitario(0);
  };

  const total = produtosWatch.reduce((sum, produto) => {
    return sum + (produto.precoUnitario * produto.quantidade);
  }, 0);

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Informações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Informações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data da Compra</Label>
              <div className="space-y-1">
                <Input
                  id="data"
                  type="date"
                  {...register('data', { valueAsDate: true })}
                  className={errors.data ? 'h-10 border-red-500 focus:border-red-500' : 'h-10'}
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
                {errors.data && (
                  <p className="text-sm text-red-500">{errors.data.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedorId">Fornecedor</Label>
              <div className="space-y-1">
                <Controller
                  control={control}
                  name="fornecedorId"
                  render={({ field }) => (
                    <Select value={String(field.value || '')} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.fornecedorId ? 'h-10 border-red-500 focus:border-red-500' : 'h-10'}>
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
                {errors.fornecedorId && (
                  <p className="text-sm text-red-500">{errors.fornecedorId.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Total Estimado</Label>
              <div className="h-10 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center">
                <span className="text-lg font-bold text-green-600">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adicionar Produtos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Adicionar Produtos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Produto</Label>
              <SearchableSelect
                options={produtoOptions}
                value={selectedProduto}
                onChange={(option) => setSelectedProduto(option?.name)}
                placeholder="Buscar produto..."
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                placeholder="0"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label>Preço Unitário (R$)</Label>
              <Input
                type="number"
                value={precoUnitario}
                onChange={(e) => setPrecoUnitario(Number(e.target.value))}
                placeholder="0.00"
                className="h-10"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddProduto}
            className="w-full h-10 bg-green-500 hover:bg-green-600"
            disabled={!selectedProduto || !quantidade || !precoUnitario}
          >
            + Adicionar Produto
          </Button>
        </CardContent>
      </Card>

      {/* Produtos Adicionados */}
      {fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produtos Selecionados ({fields.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {fields.map((field, index) => {
                const produtoCompra = produtosWatch[index];
                if (!produtoCompra) return null;
                const produto = allProdutos.find(p => p.id.toString() === produtoCompra.produtoId.toString());
                if (!produto) return null;

                const subtotal = produtoCompra.precoUnitario * produtoCompra.quantidade

                return (
                  <div key={field.id} className="flex items-center justify-between p-2">
                    <Badge variant="secondary" className="mr-2">
                      {produto.nome} • Qtd: {produtoCompra.quantidade} {produtoCompra.unidade} • R$ {produtoCompra.precoUnitario.toFixed(2)}
                    </Badge>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-semibold text-green-600 whitespace-nowrap">R$ {subtotal.toFixed(2)}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-bold">
                <span>Total Geral:</span>
                <span className="text-green-600">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {errors.produtos && (
        <p className="text-sm text-red-500">{errors.produtos.message}</p>
      )}
    </div>
  );
};