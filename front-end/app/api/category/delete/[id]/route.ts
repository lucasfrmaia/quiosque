import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await repositoryFactory.categoryRepository.delete(id);
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}