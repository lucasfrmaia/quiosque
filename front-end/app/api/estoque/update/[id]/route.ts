import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { Estoque } from '@/types/interfaces/entities';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }
    const body = await request.json() as Partial<Omit<Estoque, 'id' | 'produto'>>;
    const estoque = await repositoryFactory.estoqueRepository.update(id, body);
    return NextResponse.json({ success: true, data: estoque });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}