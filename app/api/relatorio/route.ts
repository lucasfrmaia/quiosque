import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Relatorio } from '@/types/classes/Relatorio';
import { repositoryFactory } from '@/types/RepositoryFactory';

export async function GET() {
  try {

    const relatorio = repositoryFactory.relatorio

    const [totalVendas, totalGastos, produtosEmEstoque, totalNotas] = await Promise.all([
      relatorio.getTotalVendas(),
      relatorio.getTotalGastos(),
      relatorio.getProdutosEmEstoque(),
      relatorio.getTotalNotas()
    ]);

    return NextResponse.json({
      totalVendas,
      totalGastos,
      produtosEmEstoque,
      totalNotas
    });


  } catch (error) {
    console.error('Erro ao buscar dados do relatório:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}