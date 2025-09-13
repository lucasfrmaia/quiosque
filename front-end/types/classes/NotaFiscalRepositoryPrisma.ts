import { PrismaClient } from '@prisma/client';
import { INotaFiscalRepository } from '../interfaces/repositories';
import { NotaFiscal, ProdutoEstoque } from '../interfaces/entities';

export class NotaFiscalRepositoryPrisma implements INotaFiscalRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private mapProdutoEstoque(produto: any): ProdutoEstoque {
    return {
      id: produto.id,
      preco: produto.preco,
      quantidade: produto.quantidade,
      dataValidade: produto.dataValidade.toISOString(),
      unidade: produto.unidade,
      produtoId: produto.produtoId,
      estoqueId: produto.estoqueId,
      tipo: produto.tipo,
      notaFiscals: produto.notaFiscals
    };
  }

  async findById(id: number): Promise<NotaFiscal | null> {
    const nota = await this.prisma.notaFiscal.findUnique({
      where: { id },
      include: { produto: true }
    });
    if (!nota) return null;
    return {
      id: nota.id,
      data: nota.data.toISOString(),
      total: nota.total,
      produtoId: nota.produtoId,
      produto: this.mapProdutoEstoque(nota.produto)
    };
  }

  async findAll(): Promise<NotaFiscal[]> {
    const notas = await this.prisma.notaFiscal.findMany({
      include: { produto: true }
    });
    return notas.map(n => ({
      id: n.id,
      data: n.data.toISOString(),
      total: n.total,
      produtoId: n.produtoId,
      produto: this.mapProdutoEstoque(n.produto)
    }));
  }

  async findPerPage(page: number, limit: number): Promise<NotaFiscal[]> {
    const skip = (page - 1) * limit;
    const notas = await this.prisma.notaFiscal.findMany({
      skip,
      take: limit,
      include: { produto: true }
    });
    return notas.map(n => ({
      id: n.id,
      data: n.data.toISOString(),
      total: n.total,
      produtoId: n.produtoId,
      produto: this.mapProdutoEstoque(n.produto)
    }));
  }
}