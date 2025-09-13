import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { Estoque } from '@/types/interfaces/entities';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<Estoque, 'id' | 'produto'>;
    const estoque = await repositoryFactory.estoqueRepository.create(body);
    return NextResponse.json({ success: true, data: estoque }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}