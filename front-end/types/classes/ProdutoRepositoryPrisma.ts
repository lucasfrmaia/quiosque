import { PrismaClient } from '@prisma/client';
import { IProdutoRepository } from '../interfaces/repositories';
import { Produto } from '../interfaces/interfaces';

export class ProdutoRepositoryPrisma implements IProdutoRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(produto: Omit<Produto, 'id'>): Promise<Produto> {
    const createdProduto = await this.prisma.produto.create({
      data: produto,
    });
    return {
      id: createdProduto.id,
      ...produto,
    };
  }

  async findById(id: number): Promise<Produto | null> {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
    });
    if (!produto) return null;
    return {
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      descricao: produto.descricao,
    };
  }

  async findAll(): Promise<Produto[]> {
    const produtos = await this.prisma.produto.findMany();
    return produtos.map((produto: Produto) => ({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      descricao: produto.descricao,
    }));
  }

  async update(id: number, produto: Partial<Produto>): Promise<Produto> {
    const updatedProduto = await this.prisma.produto.update({
      where: { id },
      data: produto,
    });
    return {
      id: updatedProduto.id,
      nome: updatedProduto.nome,
      preco: updatedProduto.preco,
      descricao: updatedProduto.descricao,
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.produto.delete({
      where: { id },
    });
  }
}