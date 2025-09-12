import { PrismaClient } from '@prisma/client';
import { IEstoqueRepository } from '../interfaces/repositories';
import { ItemEstoque } from '../interfaces/interfaces';

export class EstoqueRepositoryPrisma implements IEstoqueRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(estoque: Omit<ItemEstoque, 'id'>): Promise<ItemEstoque> {
    const createdEstoque = await this.prisma.estoque.create({
      data: estoque,
    });
    return {
      id: createdEstoque.id,
      ...estoque,
    };
  }

  async findById(id: number): Promise<ItemEstoque | null> {
    const estoque = await this.prisma.estoque.findUnique({
      where: { id },
    });
    if (!estoque) return null;
    return {
      id: estoque.id,
      nome: estoque.nome,
      quantidade: estoque.quantidade,
      precoUnitario: estoque.precoUnitario,
      categoria: estoque.categoria,
      dataValidade: estoque.dataValidade,
    };
  }

  async findAll(): Promise<ItemEstoque[]> {
    const estoques = await this.prisma.estoque.findMany();
    return estoques.map((estoque: ItemEstoque) => ({
      id: estoque.id,
      nome: estoque.nome,
      quantidade: estoque.quantidade,
      precoUnitario: estoque.precoUnitario,
      categoria: estoque.categoria,
      dataValidade: estoque.dataValidade,
    }));
  }

  async update(id: number, estoque: Partial<ItemEstoque>): Promise<ItemEstoque> {
    const updatedEstoque = await this.prisma.estoque.update({
      where: { id },
      data: estoque,
    });
    return {
      id: updatedEstoque.id,
      nome: updatedEstoque.nome,
      quantidade: updatedEstoque.quantidade,
      precoUnitario: updatedEstoque.precoUnitario,
      categoria: updatedEstoque.categoria,
      dataValidade: updatedEstoque.dataValidade,
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.estoque.delete({
      where: { id },
    });
  }
}