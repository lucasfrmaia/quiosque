import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotaFiscalCompra, NotaFiscalVenda, ProdutoCompra, ProdutoVenda } from '@/types/interfaces/entities';

interface NotaDetailsProps {
  nota: NotaFiscalCompra | NotaFiscalVenda;
  isCompra: boolean;
  onClose: () => void;
}

export const NotaDetails: FC<NotaDetailsProps> = ({ nota, isCompra, onClose }) => {
  const produtos = isCompra 
    ? (nota as NotaFiscalCompra).produtos as ProdutoCompra[] 
    : (nota as NotaFiscalVenda).produtos as ProdutoVenda[];

  const total = produtos.reduce((sum, p) => sum + (p.quantidade * p.precoUnitario), 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detalhes da Nota Fiscal</CardTitle>
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Informações Gerais</h3>
            <p><strong>ID:</strong> {nota.id}</p>
            <p><strong>Data:</strong> {new Date(nota.data).toLocaleDateString()}</p>
            {isCompra && (
              <p><strong>Fornecedor:</strong> {(nota as NotaFiscalCompra).fornecedor?.nome || 'N/A'}</p>
            )}
            <p><strong>Total:</strong> R$ {total.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="font-semibold">Produtos</h3>
            <div className="border rounded-md p-4">
              {produtos && produtos.length > 0 ? (
                <ul className="space-y-2">
                  {produtos.map((produto, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{produto.produto?.nome || 'Produto'}</span>
                      <span>{produto.quantidade} {produto.unidade} x R$ {produto.precoUnitario.toFixed(2)} = R$ {(produto.quantidade * produto.precoUnitario).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum produto encontrado.</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};