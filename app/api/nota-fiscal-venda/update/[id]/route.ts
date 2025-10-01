import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { NotaFiscalVenda } from '@/types/interfaces/entities';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const { id } = await params;
    const numberid = Number(id)

    if (isNaN(numberid)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const updates = await request.json() as Partial<Omit<NotaFiscalVenda, 'id' | 'produtos'>>;
    const notaFiscal = await repositoryFactory.notaFiscalVendaRepository.update(numberid, updates);

    return NextResponse.json(notaFiscal);

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}