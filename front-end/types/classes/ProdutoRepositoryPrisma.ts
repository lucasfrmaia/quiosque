import { PrismaClient } from '@prisma/client';
import { IProdutoRepository } from '../interfaces/repositories';
import { Produto, ProdutoCompra, Category } from '../interfaces/entities';

export class ProdutoRepositoryPrisma implements IProdutoRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private mapCategoria(categoria: any): Category | undefined {
    return categoria ? {
      id: categoria.id,
      name: categoria.name
    } : undefined;
  }

  private mapCompras(compras: any[]): ProdutoCompra[] {
    return compras.map(c => ({
      id: c.id,
      produtoId: c.produtoId,
      quantidade: c.quantidade,
      unidade: c.unidade,
      preco: c.preco,
      data: c.data.toISOString(),
      produto: c.produto
    }));
  }

  async findPerPage(page: number, limit: number): Promise<Produto[]> {
    const skip = (page - 1) * limit;
    const produtos = await this.prisma.produto.findMany({
      skip,
      take: limit,
      include: {
        categoria: true,
        compras: true
      }
    });
    return produtos.map(p => ({
      id: p.id,
      nome: p.nome,
      categoriaId: p.categoriaId,
      categoria: this.mapCategoria(p.categoria),
      compras: this.mapCompras(p.compras)
    }));
  }

  async create(produto: Omit<Produto, 'id' | 'categoria' | 'compras'>): Promise<Produto> {
    const createdProduto = await this.prisma.produto.create({
      data: produto,
      include: {
        categoria: true,
        compras: true
      }
    });
    return {
      id: createdProduto.id,
      nome: createdProduto.nome,
      categoriaId: createdProduto.categoriaId,
      categoria: this.mapCategoria(createdProduto.categoria),
      compras: this.mapCompras(createdProduto.compras)
    };
  }

  async findById(id: number): Promise<Produto | null> {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        categoria: true,
        compras: true
      }
    });
    if (!produto) return null;
    return {
      id: produto.id,
      nome: produto.nome,
      categoriaId: produto.categoriaId,
      categoria: this.mapCategoria(produto.categoria),
      compras: this.mapCompras(produto.compras)
    };
  }

  async findAll(): Promise<Produto[]> {
    const produtos = await this.prisma.produto.findMany({
      include: {
        categoria: true,
        compras: true
      }
    });
    return produtos.map(p => ({
      id: p.id,
      nome: p.nome,
      categoriaId: p.categoriaId,
      categoria: this.mapCategoria(p.categoria),
      compras: this.mapCompras(p.compras)
    }));
  }

  async update(id: number, produto: Partial<Omit<Produto, 'id' | 'categoria' | 'compras'>>): Promise<Produto> {
    const updatedProduto = await this.prisma.produto.update({
      where: { id },
      data: produto,
      include: {
        categoria: true,
        compras: true
      }
    });
    return {
      id: updatedProduto.id,
      nome: updatedProduto.nome,
      categoriaId: updatedProduto.categoriaId,
      categoria: this.mapCategoria(updatedProduto.categoria),
      compras: this.mapCompras(updatedProduto.compras)
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.produto.delete({
      where: { id },
    });
  }
}