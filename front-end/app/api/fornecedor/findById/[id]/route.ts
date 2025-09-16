import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const fornecedor = await repositoryFactory.fornecedorRepository.findById(id);
    if (!fornecedor) {
      return NextResponse.json({ success: false, error: 'Fornecedor not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: fornecedor });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}