import { PrismaClient } from '@prisma/client';
import { INotaFiscalVendaRepository } from '../interfaces/repositories';
import { NotaFiscalVenda, ProdutoVenda, Produto } from '../interfaces/entities';

export class NotaFiscalVendaRepositoryPrisma implements INotaFiscalVendaRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private mapProduto(produto: any): Produto {
    return {
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      imagemUrl: produto.imagemUrl,
      ativo: produto.ativo,
      tipo: produto.tipo,
      categoriaId: produto.categoriaId,
      categoria: produto.categoria,
      estoques: [],
      compras: [],
      vendas: []
    };
  }

  private mapProdutoVenda(produtoVenda: any): ProdutoVenda {
    return {
      id: produtoVenda.id,
      notaFiscalId: produtoVenda.notaFiscalId,
      produtoId: produtoVenda.produtoId,
      quantidade: produtoVenda.quantidade,
      unidade: produtoVenda.unidade,
      precoUnitario: produtoVenda.precoUnitario,
      produto: this.mapProduto(produtoVenda.produto),
      notaFiscal: produtoVenda.notaFiscal ? {
        id: produtoVenda.notaFiscal.id,
        data: produtoVenda.notaFiscal.data.toISOString(),
        total: produtoVenda.notaFiscal.total,
        produtos: []
      } : undefined
    };
  }

  private mapProdutoVendas(produtoVendas: any[]): ProdutoVenda[] {
    return produtoVendas.map(this.mapProdutoVenda);
  }

  async create(notaFiscal: Omit<NotaFiscalVenda, 'id' | 'produtos'> & { produtos: Omit<ProdutoVenda, 'id' | 'produto' | 'notaFiscal'>[] }): Promise<NotaFiscalVenda> {
    const { data, total, produtos } = notaFiscal;
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
    return {
      id: createdNotaFiscal.id,
      data: createdNotaFiscal.data.toISOString(),
      total: createdNotaFiscal.total,
      produtos: this.mapProdutoVendas(createdNotaFiscal.produtos)
    };
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
    return {
      id: notaFiscal.id,
      data: notaFiscal.data.toISOString(),
      total: notaFiscal.total,
      produtos: this.mapProdutoVendas(notaFiscal.produtos)
    };
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
    return notasFiscais.map(nf => ({
      id: nf.id,
      data: nf.data.toISOString(),
      total: nf.total,
      produtos: this.mapProdutoVendas(nf.produtos)
    }));
  }

  async findPerPage(page: number, limit: number): Promise<NotaFiscalVenda[]> {
    const skip = (page - 1) * limit;
    const notasFiscais = await this.prisma.notaFiscalVenda.findMany({
      skip,
      take: limit,
      include: {
        produtos: {
          include: {
            produto: true,
            notaFiscal: true
          }
        }
      }
    });
    return notasFiscais.map(nf => ({
      id: nf.id,
      data: nf.data.toISOString(),
      total: nf.total,
      produtos: this.mapProdutoVendas(nf.produtos)
    }));
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
    return {
      id: updatedNotaFiscal.id,
      data: updatedNotaFiscal.data.toISOString(),
      total: updatedNotaFiscal.total,
      produtos: this.mapProdutoVendas(updatedNotaFiscal.produtos)
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.notaFiscalVenda.delete({
      where: { id }
    });
  }
}