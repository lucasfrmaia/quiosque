import { NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';

export async function GET() {
  try {
    const cardapios = await repositoryFactory.cardapioRepository.findAll();
    return NextResponse.json({ success: true, data: cardapios });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}