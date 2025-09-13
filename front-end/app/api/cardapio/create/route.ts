import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { Cardapio } from '@/types/interfaces/interfaces';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<Cardapio, 'id' | 'produto'>;
    const cardapio = await repositoryFactory.cardapioRepository.create(body);
    return NextResponse.json({ success: true, data: cardapio }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}