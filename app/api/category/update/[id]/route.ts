import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { Category } from '@/types/interfaces/entities';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  try {
    const { id } = await params;
    const numberid = Number(id)

    if (isNaN(numberid)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const body: Partial<Omit<Category, 'id' | 'produtos'>> = await request.json();
    const category = await repositoryFactory.categoryRepository.update(numberid, body);
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}