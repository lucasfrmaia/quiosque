import { PrismaClient } from '@prisma/client';
import { INotaFiscalCompraRepository } from '../interfaces/repositories';
import { NotaFiscalCompra, ProdutoCompra, Produto, Fornecedor, FilterValues } from '../interfaces/entities';

export class NotaFiscalCompraRepositoryPrisma implements INotaFiscalCompraRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(notaFiscal: Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'> & { produtos: Omit<ProdutoCompra, 'id' | 'produto' | 'notaFiscal'>[] }): Promise<NotaFiscalCompra> {
    const { data, total, fornecedorId, produtos } = notaFiscal;
    const createData = {
      data: new Date(data),
      total,
      fornecedor: {
        connect: { id: fornecedorId }
      },
      produtos: {
        create: produtos.map(pc => ({
          quantidade: pc.quantidade,
          unidade: pc.unidade,
          precoUnitario: pc.precoUnitario,
          produto: {
            connect: { id: pc.produtoId }
          }
        }))
      }
    };

    const createdNotaFiscal = await this.prisma.notaFiscalCompra.create({
      data: createData,
      include: {
        fornecedor: true,
        produtos: {
          include: {
            produto: true,
            notaFiscal: true
          }
        }
      }
    });

    return createdNotaFiscal;
  }

  async findById(id: number): Promise<NotaFiscalCompra | null> {
    const notaFiscal = await this.prisma.notaFiscalCompra.findUnique({
      where: { id },
      include: {
        fornecedor: true,
        produtos: {
          include: {
            produto: true,
            notaFiscal: true
          }
        }
      }
    });

    if (!notaFiscal) return null;

    return notaFiscal;
  }

  async findAll(): Promise<NotaFiscalCompra[]> {
    const notasFiscais = await this.prisma.notaFiscalCompra.findMany({
      include: {
        fornecedor: true,
        produtos: {
          include: {
            produto: true,
            notaFiscal: true
          }
        }
      }
    });

    return notasFiscais;
  }

  async findPerPage(filters: FilterValues) {
    const { currentPage, itemsPerPage, search, dateStart, dateEnd, totalMin, totalMax, fornecedorId } = filters;
    const skip = (currentPage - 1) * itemsPerPage;
    const where: any = {};

    // Fornecedor filter
    if (fornecedorId) {
      where.fornecedorId = parseInt(fornecedorId);
    }

    // Date range filter
    const dateFilter: any = {};
    if (dateStart) {
      dateFilter.gte = new Date(dateStart);
    }
    if (dateEnd) {
      dateFilter.lte = new Date(dateEnd);
    }
    if (Object.keys(dateFilter).length > 0) {
      where.data = dateFilter;
    }

    // Total range filter
    const totalFilter: any = {};
    if (totalMin) {
      totalFilter.gte = parseFloat(totalMin);
    }
    if (totalMax) {
      totalFilter.lte = parseFloat(totalMax);
    }
    if (Object.keys(totalFilter).length > 0) {
      where.total = totalFilter;
    }

    // Search filter
    if (search) {
      where.OR = [
        { id: { equals: parseInt(search) || undefined } },
        { total: { contains: search } },
        { fornecedor: { nome: { contains: search } } },
        { produtos: { some: { produto: { nome: { contains: search } } } } }
      ].filter(Boolean);
    }

    const notas = await this.prisma.notaFiscalCompra.findMany({
      where,
      skip,
      take: itemsPerPage,
      include: {
        fornecedor: true,
        produtos: {
          include: {
            produto: true
          }
        }
      }
    });

    const total = await this.prisma.notaFiscalCompra.count({ where });

    return { notas, total };
  }

  async update(id: number, notaFiscal: Partial<Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'>>): Promise<NotaFiscalCompra> {
    const data: any = { ...notaFiscal };

    if (data.data) {
      data.data = new Date(data.data);
    }

    if (data.fornecedorId) {
      data.fornecedor = {
        connect: { id: data.fornecedorId }
      };
      delete data.fornecedorId;
    }

    const updatedNotaFiscal = await this.prisma.notaFiscalCompra.update({
      where: { id },
      data,
      include: {
        fornecedor: true,
        produtos: {
          include: {
            produto: true,
            notaFiscal: true
          }
        }
      }
    });

    return updatedNotaFiscal;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.notaFiscalCompra.delete({
      where: { id },
    });
  }
}