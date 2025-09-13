import { PrismaClient } from '@prisma/client';
import { IProdutoEstoqueRepository } from '../interfaces/repositories';
import { ProdutoEstoque } from '../interfaces/entities';

export class ProdutoEstoqueRepositoryPrisma implements IProdutoEstoqueRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }


  async findPerPage(page: number, limit: number): Promise<ProdutoEstoque[]> {
    const skip = (page - 1) * limit;
    const produtoEstoques = await this.prisma.produtoEstoque.findMany({
      skip,
      take: limit,
      include: { produto: true }
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
      produto: pe.produto
    }));
  }

  async create(produtoEstoque: Omit<ProdutoEstoque, 'id' | 'produto'>): Promise<ProdutoEstoque> {
    const createdProdutoEstoque = await this.prisma.produtoEstoque.create({
      data: {
        ...produtoEstoque,
        dataValidade: new Date(produtoEstoque.dataValidade)
      }
    });
    const fullEstoque = await this.prisma.produtoEstoque.findUnique({
      where: { id: createdProdutoEstoque.id },
      include: { produto: true }
    });
    if (!fullEstoque) throw new Error('Created item not found');
    return {
      id: fullEstoque.id,
      preco: fullEstoque.preco,
      quantidade: fullEstoque.quantidade,
      dataValidade: fullEstoque.dataValidade.toISOString(),
      unidade: fullEstoque.unidade,
      produtoId: fullEstoque.produtoId,
      estoqueId: fullEstoque.estoqueId,
      tipo: fullEstoque.tipo,
      produto: fullEstoque.produto
    };
  }

  async findById(id: number): Promise<ProdutoEstoque | null> {
    const produtoEstoque = await this.prisma.produtoEstoque.findUnique({
      where: { id },
      include: { produto: true }
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
      produto: produtoEstoque.produto
    };
  }

  async findAll(): Promise<ProdutoEstoque[]> {
    const produtoEstoques = await this.prisma.produtoEstoque.findMany({
      include: { produto: true }
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
      produto: pe.produto
    }));
  }

  async update(id: number, produtoEstoque: Partial<Omit<ProdutoEstoque, 'id' | 'produto'>>): Promise<ProdutoEstoque> {
    await this.prisma.produtoEstoque.update({
      where: { id },
      data: {
        ...produtoEstoque,
        dataValidade: produtoEstoque.dataValidade ? new Date(produtoEstoque.dataValidade) : undefined
      }
    });
    const updatedProdutoEstoque = await this.prisma.produtoEstoque.findUnique({
      where: { id },
      include: { produto: true }
    });
    if (!updatedProdutoEstoque) throw new Error('Updated item not found');
    return {
      id: updatedProdutoEstoque.id,
      preco: updatedProdutoEstoque.preco,
      quantidade: updatedProdutoEstoque.quantidade,
      dataValidade: updatedProdutoEstoque.dataValidade.toISOString(),
      unidade: updatedProdutoEstoque.unidade,
      produtoId: updatedProdutoEstoque.produtoId,
      estoqueId: updatedProdutoEstoque.estoqueId,
      tipo: updatedProdutoEstoque.tipo,
      produto: updatedProdutoEstoque.produto
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.produtoEstoque.delete({
      where: { id },
    });
  }
}