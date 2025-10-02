'use client'

import React, { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from './_components/DataTable';
import {
  useRelatorio,
  useVendasPorPeriodo,
  useProdutosMaisVendidos,
  useVendasPorCategoria,
  useMargemLucroPorProduto,
  usePosicaoEstoqueAtual,
  useCurvaABCEstoque,
  useGiroEstoque,
  useProdutosBaixoEstoque,
  useProdutosSemGiro,
  useProdutosProximaValidade,
  useComprasPorFornecedor,
} from '@/app/_components/hooks/useRelatorio';
import { FilterValues } from '@/types/interfaces/entities';

const Dashboard: FC = () => {
  // Basic metrics
  const { data: basicData, isLoading: basicLoading, error: basicError } = useRelatorio();
  const { data: produtosVendidos } = useProdutosMaisVendidos(5);
  const { data: vendasCategoria } = useVendasPorCategoria();
  const { data: margemProdutos } = useMargemLucroPorProduto(5);
  const { data: posicaoEstoque } = usePosicaoEstoqueAtual();
  const { data: baixoEstoque } = useProdutosBaixoEstoque();
  const { data: proximaValidade } = useProdutosProximaValidade();
  const { data: comprasFornecedor } = useComprasPorFornecedor();

  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const noOp = () => {};

  const emptyFilter: FilterValues = {
    currentPage: 1,
    itemsPerPage: 10
  };

  if (basicLoading) {
    return <div className="p-8 flex justify-center items-center min-h-[400px]">Carregando dashboard...</div>;
  }

  if (basicError || !basicData) {
    return <div className="p-8 text-red-600 flex justify-center items-center min-h-[400px]">Erro ao carregar dados do relatório.</div>;
  }

  const { totalVendas, totalGastos, produtosEmEstoque, totalNotas } = basicData;

  // Columns for Produtos Mais Vendidos
  const produtosVendidosColumns = [
    { key: 'nome', header: 'Produto', render: (item: any) => item.nome },
    { key: 'totalQuantidade', header: 'Quantidade', render: (item: any) => formatNumber(item.totalQuantidade) },
    { key: 'totalFaturamento', header: 'Faturamento', render: (item: any) => formatCurrency(item.totalFaturamento) },
  ];

  // Columns for Vendas por Categoria
  const vendasCategoriaColumns = [
    { key: 'nome', header: 'Categoria', render: (item: any) => item.nome },
    { key: 'totalVendas', header: 'Total Vendas', render: (item: any) => formatCurrency(item.totalVendas) },
    { key: 'totalQuantidade', header: 'Quantidade', render: (item: any) => formatNumber(item.totalQuantidade) },
  ];

  // Columns for Margem de Lucro
  const margemProdutosColumns = [
    { key: 'nome', header: 'Produto', render: (item: any) => item.nome },
    {
      key: 'margem',
      header: 'Margem (%)',
      render: (item: any) => (
        <span className={item.margem > 50 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
          {item.margem.toFixed(2)}%
        </span>
      )
    },
  ];

  // Columns for Posição de Estoque
  const posicaoEstoqueColumns = [
    { key: 'nome', header: 'Produto', render: (item: any) => item.nome },
    { key: 'quantidade', header: 'Quantidade', render: (item: any) => formatNumber(item.quantidade) },
    { key: 'valorTotal', header: 'Valor Total', render: (item: any) => formatCurrency(item.valorTotal) },
  ];

  // Columns for Baixo Estoque
  const baixoEstoqueColumns = [
    { key: 'nome', header: 'Produto', render: (item: any) => <span className="font-medium">{item.nome}</span> },
    {
      key: 'quantidadeAtual',
      header: 'Quantidade Atual',
      render: (item: any) => <span className="text-red-600 font-semibold">{formatNumber(item.quantidadeAtual)}</span>
    },
  ];

  // Columns for Próxima Validade
  const proximaValidadeColumns = [
    { key: 'nome', header: 'Produto', render: (item: any) => item.nome },
    {
      key: 'diasParaVencimento',
      header: 'Dias para Vencimento',
      render: (item: any) => <span className="text-yellow-600 font-semibold">{item.diasParaVencimento} dias</span>
    },
  ];

  // Columns for Compras por Fornecedor
  const comprasFornecedorColumns = [
    { key: 'nome', header: 'Fornecedor', render: (item: any) => item.nome },
    { key: 'totalCompras', header: 'Total Compras', render: (item: any) => formatNumber(item.totalCompras) },
    { key: 'totalValor', header: 'Total Valor', render: (item: any) => formatCurrency(item.totalValor) },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard de Relatórios</h1>
            <p className="text-gray-600 mt-2">Análises detalhadas e insights em tempo real sobre vendas, estoque e compras</p>
          </div>
          <div className="flex space-x-4">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg">Exportar Relatórios</Button>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">Configurações</Button>
          </div>
        </div>
      </div>

      {/* Basic Metrics - Enhanced Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-green-600 font-medium">Receita Total</CardDescription>
            <CardTitle className="text-2xl">Vendas Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">{formatCurrency(totalVendas)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-red-600 font-medium">Despesas Totais</CardDescription>
            <CardTitle className="text-2xl">Gastos Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-700">{formatCurrency(totalGastos)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-600 font-medium">Inventário</CardDescription>
            <CardTitle className="text-2xl">Produtos em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">{formatNumber(produtosEmEstoque)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-600 font-medium">Documentos</CardDescription>
            <CardTitle className="text-2xl">Notas Emitidas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-700">{formatNumber(totalNotas)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Relatórios de Vendas - Modern Card */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-2xl">
          <CardTitle className="text-xl">📈 Relatórios de Vendas</CardTitle>
          <CardDescription className="text-indigo-100">Análise de desempenho e tendências de vendas</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-6 p-6">
            {/* Produtos Mais Vendidos */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                <span className="text-2xl">🏆</span>
                <span>Top Produtos Vendidos</span>
              </h3>
              <DataTable
                items={produtosVendidos?.slice(0, 5) || []}
                columns={produtosVendidosColumns}
                filterValues={emptyFilter}
                emptyMessage="Nenhum produto vendido encontrado."
              />
            </div>

            {/* Vendas por Categoria */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                <span className="text-2xl">📊</span>
                <span>Vendas por Categoria</span>
              </h3>
              <DataTable
                items={vendasCategoria?.slice(0, 5) || []}
                columns={vendasCategoriaColumns}
                filterValues={emptyFilter}
                emptyMessage="Nenhuma venda por categoria encontrada."
              />
            </div>

            {/* Margem de Lucro */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                <span className="text-2xl">💰</span>
                <span>Margem de Lucro por Produto</span>
              </h3>
              <DataTable
                items={margemProdutos || []}
                columns={margemProdutosColumns}
                filterValues={emptyFilter}

                emptyMessage="Nenhum dado de margem disponível."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relatórios de Estoque - Modern Card */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-2xl">
          <CardTitle className="text-xl">📦 Relatórios de Estoque</CardTitle>
          <CardDescription className="text-emerald-100">Gestão de inventário e alertas de estoque</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-6 p-6">
            {/* Posição de Estoque */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                <span className="text-2xl">📋</span>
                <span>Posição de Estoque Atual</span>
              </h3>
              <DataTable
                items={posicaoEstoque?.slice(0, 5) || []}
                columns={posicaoEstoqueColumns}
                filterValues={emptyFilter}
                emptyMessage="Nenhum item em estoque."
              />
            </div>

            {/* Baixo Estoque */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4 text-red-800 flex items-center space-x-2">
                <span className="text-2xl">⚠️</span>
                <span>Produtos com Baixo Estoque</span>
              </h3>
              <DataTable
                items={baixoEstoque || []}
                columns={baixoEstoqueColumns}
                filterValues={emptyFilter}
                emptyMessage="Nenhum produto com baixo estoque."
              />
            </div>

            {/* Próxima Validade */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4 text-yellow-800 flex items-center space-x-2">
                <span className="text-2xl">⏰</span>
                <span>Produtos Próximos da Validade</span>
              </h3>
              <DataTable
                items={proximaValidade || []}
                columns={proximaValidadeColumns}
                filterValues={emptyFilter}
                emptyMessage="Nenhum produto próximo da validade."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relatórios de Compras - Modern Card */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-2xl">
          <CardTitle className="text-xl">🛒 Relatórios de Compras</CardTitle>
          <CardDescription className="text-orange-100">Otimização de aquisições e análise de fornecedores</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center space-x-2">
              <span className="text-2xl">👥</span>
              <span>Compras por Fornecedor</span>
            </h3>
            <DataTable
              items={comprasFornecedor?.slice(0, 5) || []}
              columns={comprasFornecedorColumns}
              filterValues={emptyFilter}
              emptyMessage="Nenhuma compra registrada."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
