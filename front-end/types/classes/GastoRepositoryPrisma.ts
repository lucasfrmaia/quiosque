import { PrismaClient } from '@prisma/client';
import { IGastoRepository } from '../interfaces/repositories';
import { GastoDiario } from '../interfaces/interfaces';

export class GastoRepositoryPrisma implements IGastoRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(gasto: Omit<GastoDiario, 'id'>): Promise<GastoDiario> {
    const createdGasto = await this.prisma.gastoDiario.create({
      data: {
        ...gasto,
        data: new Date(gasto.data),
      },
    });
    return {
      id: createdGasto.id,
      descricao: createdGasto.descricao,
      valor: createdGasto.valor,
      data: createdGasto.data.toISOString().split('T')[0],
    };
  }

  async findById(id: number): Promise<GastoDiario | null> {
    const gasto = await this.prisma.gastoDiario.findUnique({
      where: { id },
    });
    if (!gasto) return null;
    return {
      id: gasto.id,
      descricao: gasto.descricao,
      valor: gasto.valor,
      data: gasto.data.toISOString().split('T')[0],
    };
  }

  async findAll(): Promise<GastoDiario[]> {
    const gastos = await this.prisma.gastoDiario.findMany();
    return gastos.map(g => ({
      id: g.id,
      descricao: g.descricao,
      valor: g.valor,
      data: g.data.toISOString().split('T')[0],
    }));
  }

  async findPerPage(page: number, limit: number): Promise<GastoDiario[]> {
    const skip = (page - 1) * limit;
    const gastos = await this.prisma.gastoDiario.findMany({
      skip,
      take: limit,
    });
    return gastos.map(g => ({
      id: g.id,
      descricao: g.descricao,
      valor: g.valor,
      data: g.data.toISOString().split('T')[0],
    }));
  }

  async update(id: number, gasto: Partial<Omit<GastoDiario, 'id'>>): Promise<GastoDiario> {
    const data: any = { ...gasto };
    if (data.data) {
      data.data = new Date(data.data);
    }
    const updatedGasto = await this.prisma.gastoDiario.update({
      where: { id },
      data,
    });
    return {
      id: updatedGasto.id,
      descricao: updatedGasto.descricao,
      valor: updatedGasto.valor,
      data: updatedGasto.data.toISOString().split('T')[0],
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.gastoDiario.delete({
      where: { id },
    });
  }
}