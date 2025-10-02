import { PrismaClient } from '@prisma/client';
import { INotaFiscalVendaRepository } from '../interfaces/repositories';
import { NotaFiscalVenda, ProdutoVenda, Produto, FilterValues } from '../interfaces/entities';

export class NotaFiscalVendaRepositoryPrisma implements INotaFiscalVendaRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(notaFiscal: Omit<NotaFiscalVenda, 'id' | 'produtos'> & { produtos: Omit<ProdutoVenda, 'id' | 'produto' | 'notaFiscal'>[] }): Promise<NotaFiscalVenda> {
    const { data, produtos } = notaFiscal;
    const total = produtos.reduce((acc, produto) => acc + produto.precoUnitario, 0)

    const createData = {
      data: new Date(data),
      total,
      produtos: {
        create: produtos.map(pv => ({
          quantidade: pv.quantidade,
          unidade: pv.unidade,
          precoUnitario: pv.precoUnitario,
          produto: {
            connect: { id: pv.produtoId }
          }
        }))
      }
    };

    const createdNotaFiscal = await this.prisma.notaFiscalVenda.create({
      data: createData,
      include: {
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

  async findById(id: number): Promise<NotaFiscalVenda | null> {
    const notaFiscal = await this.prisma.notaFiscalVenda.findUnique({
      where: { id },
      include: {
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

  async findAll(): Promise<NotaFiscalVenda[]> {
    const notasFiscais = await this.prisma.notaFiscalVenda.findMany({
      include: {
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
    const { currentPage, itemsPerPage, search, dateStart, dateEnd, totalMin, totalMax } = filters;
    const skip = (currentPage - 1) * itemsPerPage;
    const where: any = {};

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
        { produtos: { some: { produto: { nome: { contains: search } } } } }
      ].filter(Boolean);
    }

    const notas = await this.prisma.notaFiscalVenda.findMany({
      where,
      skip,
      take: itemsPerPage,
      include: {
        produtos: {
          include: {
            produto: true
          }
        }
      }
    });

    const total = await this.prisma.notaFiscalVenda.count({ where });

    return { notas, total };
  }

  async update(id: number, notaFiscal: Partial<Omit<NotaFiscalVenda, 'id' | 'produtos'>>): Promise<NotaFiscalVenda> {
    const data: any = { ...notaFiscal };

    if (data.data) {
      data.data = new Date(data.data);
    }

    const updatedNotaFiscal = await this.prisma.notaFiscalVenda.update({
      where: { id },
      data,
      include: {
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
    await this.prisma.notaFiscalVenda.delete({
      where: { id }
    });
  }
}