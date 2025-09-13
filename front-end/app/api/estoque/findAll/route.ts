import { NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';

export async function GET() {
  try {
    const estoques = await repositoryFactory.produtoEstoqueRepository.findAll();
    return NextResponse.json({ success: true, data: estoques });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}