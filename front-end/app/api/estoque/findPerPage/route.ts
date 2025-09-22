import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json({ success: false, error: 'Invalid page or limit' }, { status: 400 });
    }

    const estoques = await repositoryFactory.produtoEstoqueRepository.findPerPage(page, limit);

    return NextResponse.json(estoques);
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}