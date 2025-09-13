import { PrismaClient } from '@prisma/client';
import { IGastoRepository } from '../interfaces/repositories';
import { ProdutoCompra, Produto } from '../interfaces/entities';

export class GastoRepositoryPrisma implements IGastoRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(gasto: Omit<ProdutoCompra, 'id' | 'produto'>): Promise<ProdutoCompra> {
    const createdGasto = await this.prisma.produtoCompra.create({
      data: {
        ...gasto,
        data: new Date(gasto.data),
      },
      include: { produto: true }
    });
    return {
      id: createdGasto.id,
      produtoId: createdGasto.produtoId,
      quantidade: createdGasto.quantidade,
      unidade: createdGasto.unidade,
      preco: createdGasto.preco,
      data: createdGasto.data.toISOString(),
      produto: createdGasto.produto
    };
  }

  async findById(id: number): Promise<ProdutoCompra | null> {
    const gasto = await this.prisma.produtoCompra.findUnique({
      where: { id },
      include: { produto: true }
    });
    if (!gasto) return null;
    return {
      id: gasto.id,
      produtoId: gasto.produtoId,
      quantidade: gasto.quantidade,
      unidade: gasto.unidade,
      preco: gasto.preco,
      data: gasto.data.toISOString(),
      produto: gasto.produto
    };
  }

  async findAll(): Promise<ProdutoCompra[]> {
    const gastos = await this.prisma.produtoCompra.findMany({
      include: { produto: true }
    });
    return gastos.map(g => ({
      id: g.id,
      produtoId: g.produtoId,
      quantidade: g.quantidade,
      unidade: g.unidade,
      preco: g.preco,
      data: g.data.toISOString(),
      produto: g.produto
    }));
  }

  async findPerPage(page: number, limit: number): Promise<ProdutoCompra[]> {
    const skip = (page - 1) * limit;
    const gastos = await this.prisma.produtoCompra.findMany({
      skip,
      take: limit,
      include: { produto: true }
    });
    return gastos.map(g => ({
      id: g.id,
      produtoId: g.produtoId,
      quantidade: g.quantidade,
      unidade: g.unidade,
      preco: g.preco,
      data: g.data.toISOString(),
      produto: g.produto
    }));
  }

  async update(id: number, gasto: Partial<Omit<ProdutoCompra, 'id' | 'produto'>>): Promise<ProdutoCompra> {
    const data: any = { ...gasto };
    if (data.data) {
      data.data = new Date(data.data);
    }
    const updatedGasto = await this.prisma.produtoCompra.update({
      where: { id },
      data,
      include: { produto: true }
    });
    return {
      id: updatedGasto.id,
      produtoId: updatedGasto.produtoId,
      quantidade: updatedGasto.quantidade,
      unidade: updatedGasto.unidade,
      preco: updatedGasto.preco,
      data: updatedGasto.data.toISOString(),
      produto: updatedGasto.produto
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.produtoCompra.delete({
      where: { id },
    });
  }
}