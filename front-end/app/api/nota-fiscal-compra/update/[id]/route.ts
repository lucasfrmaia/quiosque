import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { NotaFiscalCompra } from '@/types/interfaces/entities';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const updates = await request.json() as Partial<Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'>>;
    const notaFiscal = await repositoryFactory.notaFiscalCompraRepository.update(id, updates);
    return NextResponse.json({ success: true, data: notaFiscal });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}