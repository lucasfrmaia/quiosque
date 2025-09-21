import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const fornecedores = await repositoryFactory.fornecedorRepository.findPerPage(page, limit);

    return NextResponse.json(fornecedores);

  } catch (error) {
    console.error('Error fetching fornecedores per page:', error);
    return NextResponse.json({ error: 'Failed to fetch fornecedores' }, { status: 500 });
  }
}