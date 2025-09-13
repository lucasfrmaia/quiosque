import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }
    const cardapio = await repositoryFactory.cardapioRepository.findById(id);
    if (!cardapio) {
      return NextResponse.json({ success: false, error: 'Cardapio not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: cardapio });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}