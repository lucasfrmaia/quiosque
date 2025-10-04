import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const relatorio = repositoryFactory.relatorio;

    let data: any;

    switch (type) {
      case 'cobertura-estoque':
        const daysCobertura = parseInt(searchParams.get('days') || '30');
        data = await relatorio.getAnaliseCoberturaEstoque(daysCobertura);
        break;

      case 'necessidade-compra':
        const leadTime = parseInt(searchParams.get('leadTime') || '7');
        const estoqueMin = parseInt(searchParams.get('estoqueMin') || '10');
        data = await relatorio.getNecessidadeCompra(leadTime, estoqueMin);
        break;

      case 'lucratividade-categoria':
        data = await relatorio.getLucratividadePorCategoria();
        break;

      case 'ruptura-estoque':
        const daysRuptura = parseInt(searchParams.get('days') || '30');
        data = await relatorio.getAnaliseRupturaEstoque(daysRuptura);
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo de relatório consolidado inválido' },
          { status: 400 },
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar relatório consolidado:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
