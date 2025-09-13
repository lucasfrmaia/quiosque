import { PrismaClient } from '@prisma/client';
import { IEstoqueRepository } from '../interfaces/repositories';
import { Estoque } from '../interfaces/interfaces';

export class EstoqueRepositoryPrisma implements IEstoqueRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findPerPage(page: number, limit: number): Promise<Estoque[]> {
    const skip = (page - 1) * limit;
    const estoques = await this.prisma.estoque.findMany({
      skip,
      take: limit,
      include: { produto: true }
    });
    return estoques.map(e => ({
      id: e.id,
      nome: e.nome,
      quantidade: e.quantidade,
      precoUnitario: e.precoUnitario,
      categoria: e.categoria,
      dataValidade: e.dataValidade,
      produtoId: e.produtoId,
      produto: e.produto
    }));
  }

  async create(estoque: Omit<Estoque, 'id' | 'produto'>): Promise<Estoque> {
    const createdEstoque = await this.prisma.estoque.create({
      data: estoque,
      include: { produto: true }
    });
    return {
      id: createdEstoque.id,
      nome: createdEstoque.nome,
      quantidade: createdEstoque.quantidade,
      precoUnitario: createdEstoque.precoUnitario,
      categoria: createdEstoque.categoria,
      dataValidade: createdEstoque.dataValidade,
      produtoId: createdEstoque.produtoId,
      produto: createdEstoque.produto
    };
  }

  async findById(id: number): Promise<Estoque | null> {
    const estoque = await this.prisma.estoque.findUnique({
      where: { id },
      include: { produto: true }
    });
    if (!estoque) return null;
    return {
      id: estoque.id,
      nome: estoque.nome,
      quantidade: estoque.quantidade,
      precoUnitario: estoque.precoUnitario,
      categoria: estoque.categoria,
      dataValidade: estoque.dataValidade,
      produtoId: estoque.produtoId,
      produto: estoque.produto
    };
  }

  async findAll(): Promise<Estoque[]> {
    const estoques = await this.prisma.estoque.findMany({
      include: { produto: true }
    });
    return estoques.map((estoque) => ({
      id: estoque.id,
      nome: estoque.nome,
      quantidade: estoque.quantidade,
      precoUnitario: estoque.precoUnitario,
      categoria: estoque.categoria,
      dataValidade: estoque.dataValidade,
      produtoId: estoque.produtoId,
      produto: estoque.produto
    }));
  }

  async update(id: number, estoque: Partial<Omit<Estoque, 'id' | 'produto'>>): Promise<Estoque> {
    const updatedEstoque = await this.prisma.estoque.update({
      where: { id },
      data: estoque,
      include: { produto: true }
    });
    return {
      id: updatedEstoque.id,
      nome: updatedEstoque.nome,
      quantidade: updatedEstoque.quantidade,
      precoUnitario: updatedEstoque.precoUnitario,
      categoria: updatedEstoque.categoria,
      dataValidade: updatedEstoque.dataValidade,
      produtoId: updatedEstoque.produtoId,
      produto: updatedEstoque.produto
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.estoque.delete({
      where: { id },
    });
  }
}