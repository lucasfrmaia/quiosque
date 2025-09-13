import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { Category } from '@/types/interfaces/entities';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body: Partial<Omit<Category, 'id' | 'produtos'>> = await request.json();
    const category = await repositoryFactory.categoryRepository.update(id, body);
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}