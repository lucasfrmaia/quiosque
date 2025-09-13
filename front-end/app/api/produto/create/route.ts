import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { Produto } from '@/types/interfaces/interfaces';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<Produto, 'id' | 'notaFiscals' | 'estoques' | 'cardapios'>;
    const produto = await repositoryFactory.produtoRepository.create(body);
    return NextResponse.json({ success: true, data: produto }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}