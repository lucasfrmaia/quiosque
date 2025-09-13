import { PrismaClient } from '@prisma/client';
import { INotaFiscalRepository } from '../interfaces/repositories';
import { NotaFiscal } from '../interfaces/interfaces';

export class NotaFiscalRepositoryPrisma implements INotaFiscalRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<NotaFiscal | null> {
    const nota = await this.prisma.notaFiscal.findUnique({
      where: { id },
    });
    if (!nota) return null;
    return {
      id: nota.id,
      produtoId: nota.produtoId,
      quantidade: nota.quantidade,
      data: nota.data.toISOString().split('T')[0],
      total: nota.total,
    };
  }

  async findAll(): Promise<NotaFiscal[]> {
    const notas = await this.prisma.notaFiscal.findMany();
    return notas.map(n => ({
      id: n.id,
      produtoId: n.produtoId,
      quantidade: n.quantidade,
      data: n.data.toISOString().split('T')[0],
      total: n.total,
    }));
  }

  async findPerPage(page: number, limit: number): Promise<NotaFiscal[]> {
    const skip = (page - 1) * limit;
    const notas = await this.prisma.notaFiscal.findMany({
      skip,
      take: limit,
    });
    return notas.map(n => ({
      id: n.id,
      produtoId: n.produtoId,
      quantidade: n.quantidade,
      data: n.data.toISOString().split('T')[0],
      total: n.total,
    }));
  }
}