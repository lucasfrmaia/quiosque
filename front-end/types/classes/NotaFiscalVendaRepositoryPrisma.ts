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
    const { currentPage, itemsPerPage, search } = filters;
    const skip = (currentPage - 1) * itemsPerPage;
    const where: any = {};

    if (search) {
      where.OR = [
        { data: { contains: search } },
        { total: { contains: search  } }
      ];
    }

    const notas = await this.prisma.notaFiscalVenda.findMany({
      where,
      skip,
      take: itemsPerPage,
      include: {
        produtos: {
          include: {
            produto: true,
            notaFiscal: true
          }
        }
      }
    });

    const total = await this.prisma.notaFiscalVenda.count();

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