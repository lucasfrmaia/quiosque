import { PrismaClient } from '@prisma/client';
import { IProdutoEstoqueRepository } from '../interfaces/repositories';
import { ProdutoEstoque, Produto, FilterValues } from '../interfaces/entities';

export class ProdutoEstoqueRepositoryPrisma implements IProdutoEstoqueRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private mapProduto(produto: any): Produto {
    return {
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      imagemUrl: produto.imagemUrl,
      ativo: produto.ativo,
      tipo: produto.tipo,
      categoriaId: produto.categoriaId,
      categoria: produto.categoria ? {
        id: produto.categoria.id,
        name: produto.categoria.name,
        produtos: []
      } : null,
      estoques: [],
      compras: [],
      vendas: []
    };
  }

  async create(produtoEstoque: Omit<ProdutoEstoque, 'id' | 'produto'>): Promise<ProdutoEstoque> {
    const data = {
      ...produtoEstoque,
      dataValidade: produtoEstoque.dataValidade ? new Date(produtoEstoque.dataValidade) : null
    };
    const createdProdutoEstoque = await this.prisma.produtoEstoque.create({
      data,
      include: {
        produto: true
      }
    });
    return {
      id: createdProdutoEstoque.id,
      preco: createdProdutoEstoque.preco,
      quantidade: createdProdutoEstoque.quantidade,
      dataValidade: createdProdutoEstoque.dataValidade ? createdProdutoEstoque.dataValidade.toISOString() : null,
      unidade: createdProdutoEstoque.unidade,
      produtoId: createdProdutoEstoque.produtoId,
      produto: this.mapProduto(createdProdutoEstoque.produto)
    };
  }

  async findById(id: number): Promise<ProdutoEstoque | null> {
    const produtoEstoque = await this.prisma.produtoEstoque.findUnique({
      where: { id },
      include: {
        produto: true
      }
    });
    if (!produtoEstoque) return null;
    return {
      id: produtoEstoque.id,
      preco: produtoEstoque.preco,
      quantidade: produtoEstoque.quantidade,
      dataValidade: produtoEstoque.dataValidade ? produtoEstoque.dataValidade.toISOString() : null,
      unidade: produtoEstoque.unidade,
      produtoId: produtoEstoque.produtoId,
      produto: this.mapProduto(produtoEstoque.produto)
    };
  }

  async findAll(): Promise<ProdutoEstoque[]> {
    const produtoEstoques = await this.prisma.produtoEstoque.findMany({
      include: {
        produto: true
      }
    });

    return produtoEstoques.map(pe => ({
      id: pe.id,
      preco: pe.preco,
      quantidade: pe.quantidade,
      dataValidade: pe.dataValidade ? pe.dataValidade.toISOString() : null,
      unidade: pe.unidade,
      produtoId: pe.produtoId,
      produto: this.mapProduto(pe.produto)
    }));

  }

  async findPerPage(filters: FilterValues) {
    const { currentPage, itemsPerPage, search, categoryId, precoMin, precoMax, quantidadeMin, quantidadeMax } = filters;
    const skip = (currentPage - 1) * itemsPerPage;
    const where: any = {};

    if (search) {
      where.produto = {
        nome: {
          contains: search,
          mode: 'insensitive'
        }
      };
    }

    if (categoryId !== undefined && categoryId !== null) {
      where.produto = {
        ...where.produto,
        categoriaId: categoryId
      };
    }

    if (precoMin) {
      where.preco = {
        ...where.preco,
        gte: parseFloat(precoMin)
      };
    }

    if (precoMax) {
      where.preco = {
        ...where.preco,
        lte: parseFloat(precoMax)
      };
    }

    if (quantidadeMin) {
      where.quantidade = {
        ...where.quantidade,
        gte: parseFloat(quantidadeMin)
      };
    }

    if (quantidadeMax) {
      where.quantidade = {
        ...where.quantidade,
        lte: parseFloat(quantidadeMax)
      };
    }

    const produtoEstoques = await this.prisma.produtoEstoque.findMany({
      where,
      skip,
      take: itemsPerPage,
      include: {
        produto: {
          include: {
            categoria: true
          }
        }
      }
    });

    const estoque = produtoEstoques.map(pe => ({
      id: pe.id,
      preco: pe.preco,
      quantidade: pe.quantidade,
      dataValidade: pe.dataValidade ? pe.dataValidade.toISOString() : null,
      unidade: pe.unidade,
      produtoId: pe.produtoId,
      produto: this.mapProduto(pe.produto)
    }));

    const total = await this.prisma.produtoEstoque.count({ where });

    return {
      estoque: estoque,
      total
    }
  }

  async update(id: number, produtoEstoque: Partial<Omit<ProdutoEstoque, 'id' | 'produto'>>): Promise<ProdutoEstoque> {
    const data: any = { ...produtoEstoque };
    if (data.dataValidade) {
      data.dataValidade = new Date(data.dataValidade);
    }
    const updatedProdutoEstoque = await this.prisma.produtoEstoque.update({
      where: { id },
      data,
      include: {
        produto: true
      }
    });
    return {
      id: updatedProdutoEstoque.id,
      preco: updatedProdutoEstoque.preco,
      quantidade: updatedProdutoEstoque.quantidade,
      dataValidade: updatedProdutoEstoque.dataValidade ? updatedProdutoEstoque.dataValidade.toISOString() : null,
      unidade: updatedProdutoEstoque.unidade,
      produtoId: updatedProdutoEstoque.produtoId,
      produto: this.mapProduto(updatedProdutoEstoque.produto)
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.produtoEstoque.delete({
      where: { id },
    });
  }
}