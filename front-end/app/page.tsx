import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard: FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Visão geral do seu sistema de gestão</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">Relatórios</Button>
          <Button variant="outline">Exportar Dados</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas Totais</CardTitle>
            <CardDescription>Receita total das vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">R$ 23.456,78</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gastos Totais</CardTitle>
            <CardDescription>Total de gastos do período</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">R$ 12.345,67</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos em Estoque</CardTitle>
            <CardDescription>Itens disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">156</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notas Emitidas</CardTitle>
            <CardDescription>Total de notas fiscais</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">89</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Vendas Mensais</CardTitle>
            <CardDescription>Evolução das vendas ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Jan</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span>R$ 4.000</span>
              </div>
              <div className="flex justify-between">
                <span>Fev</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span>R$ 6.000</span>
              </div>
              <div className="flex justify-between">
                <span>Mar</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <span>R$ 8.000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo de Estoque</CardTitle>
            <CardDescription>Itens com estoque baixo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Insumos</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <span>70%</span>
              </div>
              <div className="flex justify-between">
                <span>Cardápio</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
                <span>50%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Notas Fiscais - Últimos 7 Dias</CardTitle>
            <CardDescription>Distribuição de notas de compra e venda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Compras</span>
                <span className="text-green-600">25</span>
              </div>
              <div className="flex justify-between">
                <span>Vendas</span>
                <span className="text-blue-600">35</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
            <CardDescription>Itens que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between text-sm">
                <span>Estoque baixo em "Arroz"</span>
                <span className="text-red-600">8 unidades</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>Produto vencendo "Leite"</span>
                <span className="text-yellow-600">3 dias</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>Fornecedor novo adicionado</span>
                <span className="text-blue-600">Novo</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
