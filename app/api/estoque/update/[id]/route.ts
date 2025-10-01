import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { Category, ProdutoEstoque } from '@/types/interfaces/entities';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const { id } = await params;
    const numberid = Number(id)

    if (isNaN(numberid)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const body: Partial<Omit<ProdutoEstoque, 'id' | 'produto'>> = await request.json();
    const estoque = await repositoryFactory.produtoEstoqueRepository.update(numberid, body);

    return NextResponse.json({ success: true, data: estoque });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}