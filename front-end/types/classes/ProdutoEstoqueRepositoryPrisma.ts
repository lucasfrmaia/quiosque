import { PrismaClient } from '@prisma/client';
import { IProdutoEstoqueRepository } from '../interfaces/repositories';
import { ProdutoEstoque, NotaFiscal } from '../interfaces/entities';

export class ProdutoEstoqueRepositoryPrisma implements IProdutoEstoqueRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private mapNotaFiscals(notaFiscals: any[]): NotaFiscal[] {
    return notaFiscals.map(nf => ({
      id: nf.id,
      data: nf.data.toISOString(),
      total: nf.total,
      produtoId: nf.produtoId,
      produto: nf.produto
    }));
  }

  async findPerPage(page: number, limit: number): Promise<ProdutoEstoque[]> {
    const skip = (page - 1) * limit;
    const produtoEstoques = await this.prisma.produtoEstoque.findMany({
      skip,
      take: limit,
      include: { NotaFiscals: true }
    });
    return produtoEstoques.map(pe => ({
      id: pe.id,
      preco: pe.preco,
      quantidade: pe.quantidade,
      dataValidade: pe.dataValidade.toISOString(),
      unidade: pe.unidade,
      produtoId: pe.produtoId,
      estoqueId: pe.estoqueId,
      tipo: pe.tipo,
      notaFiscals: this.mapNotaFiscals(pe.NotaFiscals)
    }));
  }

  async create(produtoEstoque: Omit<ProdutoEstoque, 'id' | 'notaFiscals'>): Promise<ProdutoEstoque> {
    const createdProdutoEstoque = await this.prisma.produtoEstoque.create({
      data: {
        ...produtoEstoque,
        dataValidade: new Date(produtoEstoque.dataValidade)
      },
      include: { NotaFiscals: true }
    });
    return {
      id: createdProdutoEstoque.id,
      preco: createdProdutoEstoque.preco,
      quantidade: createdProdutoEstoque.quantidade,
      dataValidade: createdProdutoEstoque.dataValidade.toISOString(),
      unidade: createdProdutoEstoque.unidade,
      produtoId: createdProdutoEstoque.produtoId,
      estoqueId: createdProdutoEstoque.estoqueId,
      tipo: createdProdutoEstoque.tipo,
      notaFiscals: this.mapNotaFiscals(createdProdutoEstoque.NotaFiscals)
    };
  }

  async findById(id: number): Promise<ProdutoEstoque | null> {
    const produtoEstoque = await this.prisma.produtoEstoque.findUnique({
      where: { id },
      include: { NotaFiscals: true }
    });
    if (!produtoEstoque) return null;
    return {
      id: produtoEstoque.id,
      preco: produtoEstoque.preco,
      quantidade: produtoEstoque.quantidade,
      dataValidade: produtoEstoque.dataValidade.toISOString(),
      unidade: produtoEstoque.unidade,
      produtoId: produtoEstoque.produtoId,
      estoqueId: produtoEstoque.estoqueId,
      tipo: produtoEstoque.tipo,
      notaFiscals: this.mapNotaFiscals(produtoEstoque.NotaFiscals)
    };
  }

  async findAll(): Promise<ProdutoEstoque[]> {
    const produtoEstoques = await this.prisma.produtoEstoque.findMany({
      include: { NotaFiscals: true }
    });
    return produtoEstoques.map((pe) => ({
      id: pe.id,
      preco: pe.preco,
      quantidade: pe.quantidade,
      dataValidade: pe.dataValidade.toISOString(),
      unidade: pe.unidade,
      produtoId: pe.produtoId,
      estoqueId: pe.estoqueId,
      tipo: pe.tipo,
      notaFiscals: this.mapNotaFiscals(pe.NotaFiscals)
    }));
  }

  async update(id: number, produtoEstoque: Partial<Omit<ProdutoEstoque, 'id' | 'notaFiscals'>>): Promise<ProdutoEstoque> {
    const updatedProdutoEstoque = await this.prisma.produtoEstoque.update({
      where: { id },
      data: {
        ...produtoEstoque,
        dataValidade: produtoEstoque.dataValidade ? new Date(produtoEstoque.dataValidade) : undefined
      },
      include: { NotaFiscals: true }
    });
    return {
      id: updatedProdutoEstoque.id,
      preco: updatedProdutoEstoque.preco,
      quantidade: updatedProdutoEstoque.quantidade,
      dataValidade: updatedProdutoEstoque.dataValidade.toISOString(),
      unidade: updatedProdutoEstoque.unidade,
      produtoId: updatedProdutoEstoque.produtoId,
      estoqueId: updatedProdutoEstoque.estoqueId,
      tipo: updatedProdutoEstoque.tipo,
      notaFiscals: this.mapNotaFiscals(updatedProdutoEstoque.NotaFiscals)
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.produtoEstoque.delete({
      where: { id },
    });
  }
}