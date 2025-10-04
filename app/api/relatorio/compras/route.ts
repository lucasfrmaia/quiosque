import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Relatorio } from '@/types/classes/Relatorio';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const prisma = new PrismaClient();
    const relatorio = new Relatorio(prisma);

    let data: any;

    switch (type) {
      case 'historico-produto':
        const produtoId = parseInt(searchParams.get('produtoId') || '0');
        if (!produtoId) {
          return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 });
        }
        data = await relatorio.getHistoricoComprasPorProduto(produtoId);
        break;

      case 'por-fornecedor':
        data = await relatorio.getComprasPorFornecedor();
        break;

      case 'custos-aquisicao':
        const produtoIdCusto = parseInt(searchParams.get('produtoId') || '0');
        if (!produtoIdCusto) {
          return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 });
        }
        data = await relatorio.getCustosAquisiçãoPorProduto(produtoIdCusto);
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo de relatório de compras inválido' },
          { status: 400 },
        );
    }

    await prisma.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar relatório de compras:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
