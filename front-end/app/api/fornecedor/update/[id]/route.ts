import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { Fornecedor } from '@/types/interfaces/entities';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
  
    const { id } = (params);
    const numberid = Number(id)

    if (isNaN(numberid)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }


    const updates = await request.json() as Partial<Omit<Fornecedor, 'id' | 'compras'>>;
    const fornecedor = await repositoryFactory.fornecedorRepository.update(numberid, updates);
    return NextResponse.json({ success: true, data: fornecedor });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}