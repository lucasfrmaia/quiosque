import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categories = await repositoryFactory.categoryRepository.findPerPage(page, limit);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories per page:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}