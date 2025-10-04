import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchableSelect, Option } from '../common/SearchableSelect';
import { NotaFiscalVenda, ProdutoVenda, ProdutoEstoque } from '@/types/interfaces/entities';
import { z } from 'zod';
import { notaFiscalVendaSchema } from '@/types/validation';
import { Package } from 'lucide-react';

type NotaFiscalVendaFormData = z.infer<typeof notaFiscalVendaSchema>;

interface NotaFiscalVendaFormProps {
  editing?: boolean;
}

export const NotaFiscalVendaForm: FC<NotaFiscalVendaFormProps> = ({ editing = false }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<NotaFiscalVendaFormData>();
  const produtos = watch('produtos') || [];
  const { fields, append, remove } = useFieldArray({
    control: useFormContext().control,
    name: 'produtos',
  });

  const [selectedEstoque, setSelectedEstoque] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [pendingQuantity, setPendingQuantity] = useState(1);

  useEffect(() => {
    const today = new Date();

    if (!watch('data')) {
      setValue('data', today);
    }
  }, [setValue, watch]);

  const {
    data: allEstoque,
    isLoading,
    error,
  } = useQuery<ProdutoEstoque[]>({
    queryKey: ['all-estoque-venda'],
    queryFn: async () => {
      const response = await fetch('/api/estoque/findAll');
      if (!response.ok) {
        throw new Error('Failed to fetch estoque');
      }
      const result = await response.json();
      return result;
    },
  });

  if (isLoading) return <>Carregando...</>;

  if (error) return <>Error!</>;

  const estoqueOptions =
    allEstoque?.map((estoque) => ({
      id: String(estoque.id),
      name: `${estoque.produto?.nome || 'Sem nome'} (Estoque: ${estoque.quantidade})`,
    })) || [];

  const handleAddProduto = () => {
    if (!selectedEstoque || pendingQuantity < 1) return;

    const estoque = allEstoque?.find((e) => String(e.id) === selectedEstoque.id);
    if (!estoque || !estoque.produto) return;

    append({
      produtoId: estoque!.produto!.id,
      quantidade: pendingQuantity,
      precoUnitario: estoque.preco || 0,
    });

    setSelectedEstoque(null);
    setPendingQuantity(1);
  };

  const total = produtos.reduce((sum, produto) => {
    return sum + produto.precoUnitario * produto.quantidade;
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data da Venda</Label>
              <div className="space-y-1">
                <Input
                  id="data"
                  type="date"
                  {...register('data', { valueAsDate: true })}
                  className={errors.data ? 'h-10 border-red-500 focus:border-red-500' : 'h-10'}
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
                {errors.data && <p className="text-sm text-red-500">{errors.data.message}</p>}
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
            Adicionar Produtos do Estoque
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Produto do Estoque</Label>
              <SearchableSelect
                options={estoqueOptions}
                value={selectedEstoque}
                onChange={(option) => setSelectedEstoque(option)}
                placeholder="Buscar produto no estoque..."
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                value={pendingQuantity}
                step="1"
                onChange={(e) => setPendingQuantity(parseInt(e.target.value) || 1)}
                placeholder="1"
                className="h-10"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddProduto}
            className="w-full h-10 bg-green-500 hover:bg-green-600"
            disabled={!selectedEstoque || pendingQuantity < 1}
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
                const produtoVenda = produtos[index];
                if (!produtoVenda) return null;
                const estoqueItem = allEstoque?.find(
                  (e) => e.produto!.id === produtoVenda.produtoId,
                );
                const produto = estoqueItem?.produto;
                if (!estoqueItem || !produto) return null;

                const subtotal = produtoVenda.precoUnitario * produtoVenda.quantidade;

                return (
                  <div key={field.id} className="flex items-center justify-between p-2">
                    <Badge variant="secondary" className="mr-2">
                      {produto.nome} • Qtd: {produtoVenda.quantidade} • R${' '}
                      {produtoVenda.precoUnitario.toFixed(2)}
                    </Badge>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-semibold text-green-600 whitespace-nowrap">
                        R$ {subtotal.toFixed(2)}
                      </span>
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
      {errors.produtos && <p className="text-sm text-red-500">{errors.produtos.message}</p>}
    </div>
  );
};
