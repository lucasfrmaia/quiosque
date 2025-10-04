import { PrismaClient } from '@prisma/client';
import { IFornecedorRepository } from '../interfaces/repositories';
import {
  Fornecedor,
  NotaFiscalCompra,
  ProdutoCompra,
  Produto,
  FilterValues,
} from '../interfaces/entities';

export class FornecedorRepositoryPrisma implements IFornecedorRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(fornecedor: Omit<Fornecedor, 'id' | 'compras'>): Promise<Fornecedor> {
    const createdFornecedor = await this.prisma.fornecedor.create({
      data: fornecedor,
    });

    return createdFornecedor;
  }

  async findById(id: number): Promise<Fornecedor | null> {
    const fornecedor = await this.prisma.fornecedor.findUnique({
      where: { id },
    });

    if (!fornecedor) return null;

    return fornecedor;
  }

  async findAll(): Promise<Fornecedor[]> {
    const fornecedores = await this.prisma.fornecedor.findMany();

    return fornecedores;
  }

  async findPerPage(filters: FilterValues) {
    const { currentPage, itemsPerPage, search } = filters;
    const skip = (currentPage - 1) * itemsPerPage;
    const where: any = {};

    if (search) {
      where.OR = [
        { nome: { contains: search } },
        { cnpj: { contains: search } },
        { email: { contains: search } },
        { telefone: { contains: search } },
      ];
    }

    const data = await this.prisma.fornecedor.findMany({
      where,
      skip: skip,
      take: itemsPerPage,
    });

    const total = await this.prisma.fornecedor.count();

    return {
      fornecedores: data,
      total,
    };
  }

  async update(
    id: number,
    fornecedor: Partial<Omit<Fornecedor, 'id' | 'compras'>>,
  ): Promise<Fornecedor> {
    const updatedFornecedor = await this.prisma.fornecedor.update({
      where: { id },
      data: fornecedor,
    });

    return updatedFornecedor;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.fornecedor.delete({
      where: { id },
    });
  }
}
