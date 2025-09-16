import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const nota = await repositoryFactory.notaFiscalVendaRepository.findById(id);
    if (!nota) {
      return NextResponse.json({ success: false, error: 'Nota fiscal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: nota });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}