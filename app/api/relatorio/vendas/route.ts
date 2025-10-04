import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const relatorio = repositoryFactory.relatorio;

    let data: any;

    switch (type) {
      case 'por-periodo':
        const periodo = searchParams.get('periodo') as 'daily' | 'weekly' | 'monthly' | 'annual';
        if (!periodo) {
          return NextResponse.json({ error: 'Período é obrigatório' }, { status: 400 });
        }
        data = await relatorio.getVendasPorPeriodo(periodo);
        break;

      case 'comparativo-periodos':
        const startDate1 = new Date(searchParams.get('startDate1') || '');
        const endDate1 = new Date(searchParams.get('endDate1') || '');
        const startDate2 = new Date(searchParams.get('startDate2') || '');
        const endDate2 = new Date(searchParams.get('endDate2') || '');
        if (
          isNaN(startDate1.getTime()) ||
          isNaN(endDate1.getTime()) ||
          isNaN(startDate2.getTime()) ||
          isNaN(endDate2.getTime())
        ) {
          return NextResponse.json(
            { error: 'Datas são obrigatórias e inválidas' },
            { status: 400 },
          );
        }
        data = await relatorio.getComparativoPeriodos(startDate1, endDate1, startDate2, endDate2);
        break;

      case 'produtos-mais-vendidos':
        const limit = parseInt(searchParams.get('limit') || '10');
        const by = (searchParams.get('by') as 'quantidade' | 'faturamento') || 'faturamento';
        data = await relatorio.getProdutosMaisVendidos(limit, by);
        break;

      case 'vendas-por-categoria':
        data = await relatorio.getVendasPorCategoria();
        break;

      case 'margem-lucro':
        const limitMargem = parseInt(searchParams.get('limit') || '10');
        data = await relatorio.getMargemLucroPorProduto(limitMargem);
        break;

      default:
        return NextResponse.json({ error: 'Tipo de relatório inválido' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar relatório de vendas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
