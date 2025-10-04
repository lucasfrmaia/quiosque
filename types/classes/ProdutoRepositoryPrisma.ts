import { PrismaClient } from '@prisma/client';
import { IProdutoRepository } from '../interfaces/repositories';
import {
  Produto,
  Category,
  ProdutoEstoque,
  ProdutoCompra,
  ProdutoVenda,
  NotaFiscalCompra,
  NotaFiscalVenda,
  Fornecedor,
  FilterValues,
} from '../interfaces/entities';

export class ProdutoRepositoryPrisma implements IProdutoRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(
    produto: Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>,
  ): Promise<Produto> {
    const createdProduto = await this.prisma.produto.create({
      data: {
        ...produto,
        categoriaId: Number(produto.categoriaId),
      },
      include: {
        categoria: true,
        estoques: true,
      },
    });

    return createdProduto;
  }

  async findById(id: number): Promise<Produto | null> {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        categoria: true,
        estoques: true,
      },
    });

    if (!produto) return null;

    return produto;
  }

  async findAll(): Promise<Produto[]> {
    const produtos = await this.prisma.produto.findMany({
      include: {
        categoria: true,
        estoques: true,
      },
    });

    return produtos;
  }

  async findPerPage(filters: FilterValues) {
    const { currentPage, itemsPerPage, search, categoryId } = filters;
    const skip = (currentPage - 1) * itemsPerPage;
    const where: any = {};

    if (search) {
      where.nome = {
        contains: search,
      };
    }

    if (categoryId !== undefined && categoryId !== null) {
      where.categoriaId = categoryId;
    }

    const response = await this.prisma.produto.findMany({
      where,
      skip,
      take: itemsPerPage,
      include: {
        categoria: true,
        estoques: true,
      },
    });

    const total = await this.prisma.produto.count();

    return {
      produtos: response,
      total: total,
    };
  }

  async update(
    id: number,
    produto: Partial<Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>>,
  ): Promise<Produto> {
    const updatedProduto = await this.prisma.produto.update({
      where: { id },
      data: {
        ...produto,
        categoriaId: Number(produto.categoriaId),
      },
      include: {
        categoria: true,
        estoques: true,
      },
    });

    return updatedProduto;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.produto.delete({
      where: { id },
    });
  }
}
