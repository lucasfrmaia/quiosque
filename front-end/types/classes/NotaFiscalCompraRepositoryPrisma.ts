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
    const { currentPage, itemsPerPage, search } = filters;
    const skip = (currentPage - 1) * itemsPerPage;
    const where: any = {};

    if (search) {
      where.OR = [
        { data: { contains: search, mode: 'insensitive' } },
        { total: { contains: search, mode: 'insensitive' } },
        { fornecedor: { nome: { contains: search, mode: 'insensitive' } } }
      ];
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


    const total = await this.prisma.notaFiscalCompra.count();

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