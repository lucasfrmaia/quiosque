import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { FilterValues } from '@/types/interfaces/entities';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const currentPage = parseInt(searchParams.get('page') || '1');
    const itemsPerPage = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;

    if (isNaN(currentPage) || isNaN(itemsPerPage) || currentPage < 1 || itemsPerPage < 1) {
      return NextResponse.json({ success: false, error: 'Invalid page or limit' }, { status: 400 });
    }

    const filters: FilterValues = {
      currentPage,
      itemsPerPage,
      search,
      categoryId: undefined,
      quantidadeMin: undefined,
      quantidadeMax: undefined,
      precoMin: undefined,
      precoMax: undefined,
    };

    const result = await repositoryFactory.userRepository.findPerPage(filters);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}