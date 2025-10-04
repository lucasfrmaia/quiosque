import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  NotaFiscalCompra,
  NotaFiscalVenda,
  ProdutoCompra,
  ProdutoVenda,
} from '@/types/interfaces/entities';
import { Button } from '@/components/ui/button';
import { X, Calendar, User, Package, DollarSign, Receipt } from 'lucide-react';

interface NotaDetailsProps {
  nota: NotaFiscalCompra | NotaFiscalVenda;
}

export const NotaDetails: FC<NotaDetailsProps> = ({ nota }) => {
  const isCompra = 'fornecedorId' in nota;
  const produtos = isCompra
    ? ((nota as NotaFiscalCompra).produtos as ProdutoCompra[])
    : ((nota as NotaFiscalVenda).produtos as ProdutoVenda[]);

  const total = produtos.reduce((sum, p) => sum + p.quantidade * p.precoUnitario, 0);
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="flex flex-col max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-200">
      <div className="flex-1 overflow-hidden p-6">
        <div className="space-y-6 h-full flex flex-col">
          {/* Informações Gerais */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
              <Package className="h-5 w-5 text-gray-600" />
              Informações Gerais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Data
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(nota.data).toLocaleDateString('pt-BR', {
                    timeZone: 'America/Fortaleza',
                  })}
                </p>
              </div>
              {isCompra && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Fornecedor
                  </label>
                  <Badge
                    variant="secondary"
                    className="text-sm px-3 py-1 bg-blue-100 text-blue-800"
                  >
                    {(nota as NotaFiscalCompra).fornecedor?.nome || 'N/A'}
                  </Badge>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Total
                </label>
                <p className="text-xl font-bold text-green-600">{formatCurrency(total)}</p>
              </div>
            </div>
          </div>

          {/* Produtos */}
          <div className="flex-1 flex flex-col">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
              <Package className="h-5 w-5 text-gray-600" />
              Produtos
            </h3>
            {produtos && produtos.length > 0 ? (
              <div className="flex-1 overflow-auto border border-gray-200 rounded-xl">
                <Table>
                  <TableHeader className="bg-gray-50 sticky top-0">
                    <TableRow>
                      <TableHead className="w-1/2 font-semibold text-gray-700">Produto</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700">Qtd.</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700">
                        Preço Unit.
                      </TableHead>
                      <TableHead className="text-right font-semibold text-gray-700">
                        Subtotal
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtos.map((produto, index) => {
                      const subtotal = produto.quantidade * produto.precoUnitario;
                      return (
                        <TableRow
                          key={index}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-medium text-gray-900">
                            <div className="space-y-1">
                              <p>{produto.produto?.nome || 'Produto sem nome'}</p>
                              {produto.produto?.descricao && (
                                <p className="text-sm text-gray-500">{produto.produto.descricao}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-gray-900">
                            {produto.quantidade} {produto.unidade}
                          </TableCell>
                          <TableCell className="text-right text-gray-600">
                            {formatCurrency(produto.precoUnitario)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            {formatCurrency(subtotal)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-green-50">
                      <TableCell
                        colSpan={3}
                        className="text-right font-bold text-lg text-gray-900 pr-4"
                      >
                        Total Geral
                      </TableCell>
                      <TableCell className="text-right font-bold text-xl text-green-600">
                        {formatCurrency(total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500">Nenhum produto encontrado nesta nota fiscal.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
