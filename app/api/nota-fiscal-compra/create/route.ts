import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { NotaFiscalCompra, ProdutoCompra } from '@/types/interfaces/entities';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Omit<
      NotaFiscalCompra,
      'id' | 'fornecedor' | 'produtos'
    > & { produtos: Omit<ProdutoCompra, 'id' | 'produto' | 'notaFiscal'>[] };
    const notaFiscal = await repositoryFactory.notaFiscalCompraRepository.create(body);

    return NextResponse.json(notaFiscal, { status: 201 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
