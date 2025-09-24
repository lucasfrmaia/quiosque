import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NotaFiscalVenda, ProdutoVenda, ProdutoEstoque } from '@/types/interfaces/entities';
import { NotaFiscalVendaSchema } from '@/types/validation';

interface NotaFiscalVendaFormProps {
  editing?: boolean;
}

export const NotaFiscalVendaForm: FC<NotaFiscalVendaFormProps> = ({ editing = false }) => {
  const { register, watch, setValue } = useFormContext<NotaFiscalVendaSchema>();
  const produtos = watch('produtos') || [];
  const { fields, append, remove } = useFieldArray({
    control: useFormContext().control,
    name: "produtos"
  });

  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEstoqueId, setSelectedEstoqueId] = useState<string | null>(null);
  const [pendingQuantity, setPendingQuantity] = useState('1');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!watch('data')) {
      setValue('data', today);
    }
  }, [setValue, watch]);

  const { data: allEstoque, isLoading, error } = useQuery<ProdutoEstoque[]>({
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


  if (isLoading)
    return <>Carregando...</>

  if (error)
    return <>Error!</>

  const filteredEstoque = allEstoque?.filter((estoque) =>
    estoque.produto?.nome?.toLowerCase().includes(search.toLowerCase()) || false
  );

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

      <div>
        <Label className="text-sm font-medium">Produtos</Label>

        {/* Searchable Product Select */}
        <div className="relative mt-2">
          <Input
            placeholder="Buscar produto pelo nome..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            className="w-full"
          />
          {isOpen && (
            <div className="absolute z-50 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto mt-1">
              {isLoading ? (
                <div className="p-3 text-gray-500">Carregando produtos...</div>
              ) : (filteredEstoque?.length || 0) > 0 ? (
                filteredEstoque?.map((estoque) => (
                  <div
                    key={estoque.id}
                    className="p-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                    onClick={() => {
                      setSelectedEstoqueId(estoque.id.toString());
                      setSearch(estoque.produto?.nome || '');
                      setIsOpen(false);
                    }}
                  >
                    <div>
                      <div className="font-medium">{estoque.produto?.nome}</div>
                      <div className="text-sm text-gray-500">
                        Estoque: {estoque.quantidade} | Preço: R$ {estoque.preco || 0}
                      </div>
                    </div>
                  </div>
                ))
              ) : search ? (
                <div className="p-3 text-gray-500">Nenhum produto encontrado.</div>
              ) : (
                <div className="p-3 text-gray-500">Digite para buscar produtos.</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          {selectedEstoqueId ? (
            <>
              <Input
                type="number"
                value={pendingQuantity}
                onChange={(e) => setPendingQuantity(e.target.value)}
                placeholder="Quantidade"
                min="1"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => {
                  const estoque = allEstoque?.find((e) => e.id.toString() === selectedEstoqueId);
                  if (estoque && pendingQuantity && estoque.produto) {
                    append({
                      produtoId: estoque.produto.id.toString(),
                      quantidade: pendingQuantity,
                      unidade: estoque.unidade || 'Unidade',
                      precoUnitario: (estoque.preco || 0).toString(),
                    });
                    setSelectedEstoqueId(null);
                    setPendingQuantity('1');
                    setSearch('');
                  }
                }}
                disabled={!pendingQuantity || parseFloat(pendingQuantity) < 1}
              >
                Adicionar
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedEstoqueId(null);
                  setPendingQuantity('1');
                  setSearch('');
                }}
              >
                Limpar
              </Button>
            </>
          ) : (
            <p className="text-sm text-gray-500 flex-1">Selecione um produto acima para adicionar.</p>
          )}
        </div>

        {/* Added Products Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {fields.map((field, index) => {
            const produtoVenda = produtos[index];
            if (!produtoVenda) return null;
            const estoqueItem = allEstoque?.find((e) => e.produto?.id === produtoVenda.produtoId);
            const produto = estoqueItem?.produto;
            if (!estoqueItem || !produto) return null;

            return (
              <Badge key={field.id} variant="secondary" className="flex items-center gap-1 px-3 py-1 text-xs">
                <span className="flex-1 min-w-0 truncate">
                  {produto.nome} - {produtoVenda.quantidade} x R$ {produtoVenda.precoUnitario}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => remove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
          {produtos.length === 0 && (
            <p className="text-sm text-gray-500">Nenhum produto adicionado.</p>
          )}
        </div>
      </div>
    </div>
  );
};