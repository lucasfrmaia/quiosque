import { PrismaClient } from '@prisma/client';
import { IProdutoRepository } from '../interfaces/repositories';
import { Produto } from '../interfaces/interfaces';

export class ProdutoRepositoryPrisma implements IProdutoRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async findPerPage(page: number, limit: number): Promise<Produto[]> {
    const skip = (page - 1) * limit;
    return this.prisma.produto.findMany({
      skip,
      take: limit,
      include: {
        notaFiscals: true,
        estoques: true,
        cardapios: true
      }
    });
  }

  async create(produto: Omit<Produto, 'id' | 'notaFiscals' | 'estoques' | 'cardapios'>): Promise<Produto> {
    const createdProduto = await this.prisma.produto.create({
      data: produto,
      include: {
        notaFiscals: true,
        estoques: true,
        cardapios: true
      }
    });

    return {
      id: createdProduto.id,
      nome: createdProduto.nome,
      preco: createdProduto.preco,
      descricao: createdProduto.descricao,
      notaFiscals: createdProduto.notaFiscals,
      estoques: createdProduto.estoques,
      cardapios: createdProduto.cardapios
    };
  }

  async findById(id: number): Promise<Produto | null> {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        notaFiscals: true,
        estoques: true,
        cardapios: true
      }
    });
    if (!produto) return null;
    return {
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      descricao: produto.descricao,
      notaFiscals: produto.notaFiscals,
      estoques: produto.estoques,
      cardapios: produto.cardapios
    };
  }

  async findAll(): Promise<Produto[]> {
    return this.prisma.produto.findMany({
      include: {
        notaFiscals: true,
        estoques: true,
        cardapios: true
      }
    });
  }

  async update(id: number, produto: Partial<Omit<Produto, 'id' | 'notaFiscals' | 'estoques' | 'cardapios'>>): Promise<Produto> {
    const updatedProduto = await this.prisma.produto.update({
      where: { id },
      data: produto,
      include: {
        notaFiscals: true,
        estoques: true,
        cardapios: true
      }
    });
    return {
      id: updatedProduto.id,
      nome: updatedProduto.nome,
      preco: updatedProduto.preco,
      descricao: updatedProduto.descricao,
      notaFiscals: updatedProduto.notaFiscals,
      estoques: updatedProduto.estoques,
      cardapios: updatedProduto.cardapios
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.produto.delete({
      where: { id },
    });
  }
}