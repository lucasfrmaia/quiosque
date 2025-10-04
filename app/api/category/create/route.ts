import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { Category } from '@/types/interfaces/entities';

export async function POST(request: NextRequest) {
  try {
    const body: Omit<Category, 'id' | 'produtos'> = await request.json();
    const category = await repositoryFactory.categoryRepository.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
