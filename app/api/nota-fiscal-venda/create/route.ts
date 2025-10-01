import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { NotaFiscalVenda, ProdutoVenda } from '@/types/interfaces/entities';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<NotaFiscalVenda, 'id' | 'produtos'> & { produtos: Omit<ProdutoVenda, 'id' | 'produto' | 'notaFiscal'>[] };
    const notaFiscal = await repositoryFactory.notaFiscalVendaRepository.create(body);
    return NextResponse.json({ success: true, data: notaFiscal }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}