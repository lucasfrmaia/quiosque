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
    };

    const result = await repositoryFactory.notaFiscalVendaRepository.findPerPage(filters);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching nota fiscal venda per page:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch nota fiscal venda' },
      { status: 500 },
    );
  }
}
