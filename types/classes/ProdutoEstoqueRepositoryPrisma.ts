import { PrismaClient } from '@prisma/client';
import { IProdutoEstoqueRepository } from '../interfaces/repositories';
import { ProdutoEstoque, Produto, FilterValues, TipoProduto } from '../interfaces/entities';

export class ProdutoEstoqueRepositoryPrisma implements IProdutoEstoqueRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(produtoEstoque: Omit<ProdutoEstoque, 'id' | 'produto'>): Promise<ProdutoEstoque> {
    const createdProdutoEstoque = await this.prisma.produtoEstoque.create({
      data: {
        quantidade: produtoEstoque.quantidade,
        dataValidade: produtoEstoque.dataValidade,
        preco: produtoEstoque.preco,
        unidade: produtoEstoque.unidade,
        produtoId: Number(produtoEstoque.produtoId),
        estocavel: produtoEstoque.estocavel,
      },
      include: {
        produto: true,
      },
    });

    return createdProdutoEstoque;
  }

  async findById(id: number): Promise<ProdutoEstoque | null> {
    const produtoEstoque = await this.prisma.produtoEstoque.findUnique({
      where: { id },
      include: {
        produto: true,
      },
    });

    if (!produtoEstoque) return null;

    return produtoEstoque;
  }

  async findAll(): Promise<ProdutoEstoque[]> {
    const produtoEstoques = await this.prisma.produtoEstoque.findMany({
      include: {
        produto: true,
      },
    });

    return produtoEstoques;
  }

  async findPerPage(filters: FilterValues) {
    const {
      currentPage,
      itemsPerPage,
      search,
      categoryId,
      precoMin,
      precoMax,
      quantidadeMin,
      quantidadeMax,
    } = filters;
    const skip = (currentPage - 1) * itemsPerPage;
    const where: any = {};

    if (search) {
      where.produto = {
        nome: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    if (categoryId !== undefined && categoryId !== null) {
      where.produto = {
        ...where.produto,
        categoriaId: categoryId,
      };
    }

    if (precoMin) {
      where.preco = {
        ...where.preco,
        gte: parseFloat(precoMin),
      };
    }

    if (precoMax) {
      where.preco = {
        ...where.preco,
        lte: parseFloat(precoMax),
      };
    }

    if (quantidadeMin) {
      where.quantidade = {
        ...where.quantidade,
        gte: parseFloat(quantidadeMin),
      };
    }

    if (quantidadeMax) {
      where.quantidade = {
        ...where.quantidade,
        lte: parseFloat(quantidadeMax),
      };
    }

    const produtoEstoques = await this.prisma.produtoEstoque.findMany({
      where,
      skip,
      take: itemsPerPage,
      include: {
        produto: {
          include: {
            categoria: true,
          },
        },
      },
    });

    const total = await this.prisma.produtoEstoque.count();
    return {
      estoque: produtoEstoques,
      total,
    };
  }

  async update(
    id: number,
    produtoEstoque: Partial<Omit<ProdutoEstoque, 'id' | 'produto'>>,
  ): Promise<ProdutoEstoque> {
    const data = {
      ...produtoEstoque,
      produtoId: Number(produtoEstoque.produtoId),
    };

    if (data.dataValidade) {
      data.dataValidade = new Date(data.dataValidade);
    }

    const updatedProdutoEstoque = await this.prisma.produtoEstoque.update({
      where: { id },
      data,
      include: {
        produto: true,
      },
    });

    return updatedProdutoEstoque;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.produtoEstoque.delete({
      where: { id },
    });
  }
}
