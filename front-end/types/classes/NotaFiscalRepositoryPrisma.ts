import { PrismaClient } from '@prisma/client';
import { INotaFiscalRepository } from '../interfaces/repositories';
import { NotaFiscal, ProdutoNotaFiscal, Produto } from '../interfaces/entities';

export class NotaFiscalRepositoryPrisma implements INotaFiscalRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private mapProdutoNotaFiscal(pnf: any): ProdutoNotaFiscal {
    return {
      id: pnf.id,
      produtoId: pnf.produtoId,
      notaFiscalId: pnf.notaFiscalId,
      quantidade: pnf.quantidade,
      unidade: pnf.unidade,
      preco: pnf.preco,
      produto: pnf.produto ? {
        id: pnf.produto.id,
        nome: pnf.produto.nome,
        categoriaId: pnf.produto.categoriaId,
        categoria: pnf.produto.categoria,
        compras: pnf.produto.compras,
        notaFiscals: pnf.produto.notaFiscals
      } : undefined,
      notaFiscal: pnf.notaFiscal ? {
        id: pnf.notaFiscal.id,
        data: pnf.notaFiscal.data.toISOString(),
        total: pnf.notaFiscal.total,
        produtos: pnf.notaFiscal.produtos
      } : undefined
    };
  }

  async findById(id: number): Promise<NotaFiscal | null> {
    const nota = await this.prisma.notaFiscal.findUnique({
      where: { id },
      include: { produtos: { include: { produto: true } } }
    });
    if (!nota) return null;
    return {
      id: nota.id,
      data: nota.data.toISOString(),
      total: nota.total,
      produtos: nota.produtos ? nota.produtos.map(this.mapProdutoNotaFiscal) : []
    };
  }

  async findAll(): Promise<NotaFiscal[]> {
    const notas = await this.prisma.notaFiscal.findMany({
      include: { produtos: { include: { produto: true } } }
    });
    return notas.map(n => ({
      id: n.id,
      data: n.data.toISOString(),
      total: n.total,
      produtos: n.produtos ? n.produtos.map(this.mapProdutoNotaFiscal) : []
    }));
  }

  async findPerPage(page: number, limit: number): Promise<NotaFiscal[]> {
    const skip = (page - 1) * limit;
    const notas = await this.prisma.notaFiscal.findMany({
      skip,
      take: limit,
      include: { produtos: { include: { produto: true } } }
    });
    return notas.map(n => ({
      id: n.id,
      data: n.data.toISOString(),
      total: n.total,
      produtos: n.produtos ? n.produtos.map(this.mapProdutoNotaFiscal) : []
    }));
  }
}