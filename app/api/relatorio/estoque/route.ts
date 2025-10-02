import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const relatorio = repositoryFactory.relatorio;

    let data: any;

    switch (type) {
      case 'posicao-atual':
        data = await relatorio.getPosicaoEstoqueAtual();
        break;

      case 'curva-abc':
        data = await relatorio.getCurvaABCEstoque();
        break;

      case 'giro':
        const periodoGiro = searchParams.get('periodo') as 'monthly' | 'annual' || 'monthly';
        data = await relatorio.getGiroEstoque(periodoGiro);
        break;

      case 'baixo-estoque':
        const minLevel = parseInt(searchParams.get('minLevel') || '10');
        data = await relatorio.getProdutosBaixoEstoque(minLevel);
        break;

      case 'sem-giro':
        const daysSemGiro = parseInt(searchParams.get('days') || '90');
        data = await relatorio.getProdutosSemGiro(daysSemGiro);
        break;

      case 'proxima-validade':
        const daysValidade = parseInt(searchParams.get('days') || '30');
        data = await relatorio.getProdutosProximaValidade(daysValidade);
        break;

      default:
        return NextResponse.json({ error: 'Tipo de relatório de estoque inválido' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar relatório de estoque:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}