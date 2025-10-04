import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { FilterValues } from '@/types/interfaces/entities';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const currentPage = parseInt(searchParams.get('page') || '1');
    const itemsPerPage = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('categoryId')
      ? parseInt(searchParams.get('categoryId')!)
      : undefined;
    const precoMin = searchParams.get('precoMin') || undefined;
    const precoMax = searchParams.get('precoMax') || undefined;
    const quantidadeMin = searchParams.get('quantidadeMin') || undefined;
    const quantidadeMax = searchParams.get('quantidadeMax') || undefined;

    if (isNaN(currentPage) || isNaN(itemsPerPage) || currentPage < 1 || itemsPerPage < 1) {
      return NextResponse.json({ success: false, error: 'Invalid page or limit' }, { status: 400 });
    }

    const filters: FilterValues = {
      currentPage,
      itemsPerPage,
      search,
      categoryId,
      precoMin,
      precoMax,
      quantidadeMin,
      quantidadeMax,
    };

    const result = await repositoryFactory.produtoEstoqueRepository.findPerPage(filters);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
