import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { NotaFiscalVenda, ProdutoVenda, ProdutoEstoque } from '@/types/interfaces/entities';

export interface NotaFiscalVendaFormData {
  data: string;
  total: string;
  produtos: Array<{
    produtoId: string;
    quantidade: string;
    unidade: string;
    precoUnitario: string;
  }>;
}

interface NotaFiscalVendaFormProps {
  editing?: boolean;
}

export const NotaFiscalVendaForm: FC<NotaFiscalVendaFormProps> = ({ editing = false }) => {
  const { register } = useFormContext<NotaFiscalVendaFormData>();
  const { fields, append, remove } = useFieldArray({
    control: useFormContext().control,
    name: "produtos"
  });

  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

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

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="total" className="text-right">
          Total
        </Label>
        <Input
          id="total"
          type="number"
          {...register('total')}
          className="col-span-3"
          placeholder="Total da nota fiscal"
          step="0.01"
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
                      if (estoque.produto) {
                        append({
                          produtoId: estoque.produto.id.toString(),
                          quantidade: '1',
                          unidade: estoque.unidade || 'Unidade',
                          precoUnitario: (estoque.preco || 0).toString(),
                        });
                        setSearch('');
                        setIsOpen(false);
                      }
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

        {/* Added Products Badges */}
        <div className="mt-4 space-y-2">
          {fields.map((field, index) => {
            const estoqueItem = allEstoque?.find((e) => e.produto?.id?.toString() === field.id);
            const produto = estoqueItem?.produto;
            if (!estoqueItem || !produto) return null;

            return (
              <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <div className="flex-1 font-medium min-w-0 truncate">{produto.nome}</div>
                <div className="flex items-center gap-1">
                  <Label className="text-sm whitespace-nowrap">Qtd:</Label>
                  <Input
                    type="number"
                    {...register(`produtos.${index}.quantidade` as const)}
                    className="w-16"
                    min="1"
                    placeholder="1"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Label className="text-sm whitespace-nowrap">Un:</Label>
                  <Input
                    {...register(`produtos.${index}.unidade` as const)}
                    className="w-12"
                    placeholder="un"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Label className="text-sm whitespace-nowrap">R$:</Label>
                  <Input
                    type="number"
                    {...register(`produtos.${index}.precoUnitario` as const)}
                    className="w-20"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          {fields.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">Nenhum produto adicionado.</p>
          )}
        </div>
      </div>
    </div>
  );
};