import { NextRequest, NextResponse } from 'next/server';
import { repositoryFactory } from '@/types/RepositoryFactory';
import { GastoDiario } from '@/types/interfaces/entities';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<GastoDiario, 'id'>;
    const gasto = await repositoryFactory.gastoRepository.create(body);
    return NextResponse.json({ success: true, data: gasto }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}