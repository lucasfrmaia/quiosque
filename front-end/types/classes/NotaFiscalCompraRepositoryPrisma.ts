import { PrismaClient } from '@prisma/client';
import { INotaFiscalCompraRepository } from '../interfaces/repositories';
import { NotaFiscalCompra, ProdutoCompra, Produto, Fornecedor } from '../interfaces/entities';

export class NotaFiscalCompraRepositoryPrisma implements INotaFiscalCompraRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private mapFornecedor(fornecedor: any): Fornecedor {
    return {
      id: fornecedor.id,
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      telefone: fornecedor.telefone,
      email: fornecedor.email,
      compras: []
    };
  }

  private mapProdutoCompra(produtoCompra: any): ProdutoCompra {
    return {
      id: produtoCompra.id,
      notaFiscalId: produtoCompra.notaFiscalId,
      produtoId: produtoCompra.produtoId,
      quantidade: produtoCompra.quantidade,
      unidade: produtoCompra.unidade,
      precoUnitario: produtoCompra.precoUnitario,
      produto: {
        id: produtoCompra.produto.id,
        nome: produtoCompra.produto.nome,
        descricao: produtoCompra.produto.descricao,
        imagemUrl: produtoCompra.produto.imagemUrl,
        ativo: produtoCompra.produto.ativo,
        tipo: produtoCompra.produto.tipo,
        categoriaId: produtoCompra.produto.categoriaId,
        categoria: produtoCompra.produto.categoria,
        estoques: [],
        compras: [],
        vendas: []
      },
      notaFiscal: produtoCompra.notaFiscal ? {
        id: produtoCompra.notaFiscal.id,
        data: produtoCompra.notaFiscal.data.toISOString(),
        total: produtoCompra.notaFiscal.total,
        fornecedorId: produtoCompra.notaFiscal.fornecedorId,
        fornecedor: this.mapFornecedor(produtoCompra.notaFiscal.fornecedor)
      } : undefined
    };
  }

  private mapProdutoCompras(produtoCompras: any[]): ProdutoCompra[] {
    return produtoCompras.map(this.mapProdutoCompra);
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
    return {
      id: createdNotaFiscal.id,
      data: createdNotaFiscal.data.toISOString(),
      total: createdNotaFiscal.total,
      fornecedorId: createdNotaFiscal.fornecedorId,
      fornecedor: this.mapFornecedor(createdNotaFiscal.fornecedor),
      produtos: this.mapProdutoCompras(createdNotaFiscal.produtos)
    };
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
    return {
      id: notaFiscal.id,
      data: notaFiscal.data.toISOString(),
      total: notaFiscal.total,
      fornecedorId: notaFiscal.fornecedorId,
      fornecedor: this.mapFornecedor(notaFiscal.fornecedor),
      produtos: this.mapProdutoCompras(notaFiscal.produtos)
    };
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
    return notasFiscais.map(nf => ({
      id: nf.id,
      data: nf.data.toISOString(),
      total: nf.total,
      fornecedorId: nf.fornecedorId,
      fornecedor: this.mapFornecedor(nf.fornecedor),
      produtos: this.mapProdutoCompras(nf.produtos)
    }));
  }

  async findPerPage(page: number, limit: number): Promise<NotaFiscalCompra[]> {
    const skip = (page - 1) * limit;
    const notasFiscais = await this.prisma.notaFiscalCompra.findMany({
      skip,
      take: limit,
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
    return notasFiscais.map(nf => ({
      id: nf.id,
      data: nf.data.toISOString(),
      total: nf.total,
      fornecedorId: nf.fornecedorId,
      fornecedor: this.mapFornecedor(nf.fornecedor),
      produtos: this.mapProdutoCompras(nf.produtos)
    }));
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
    return {
      id: updatedNotaFiscal.id,
      data: updatedNotaFiscal.data.toISOString(),
      total: updatedNotaFiscal.total,
      fornecedorId: updatedNotaFiscal.fornecedorId,
      fornecedor: this.mapFornecedor(updatedNotaFiscal.fornecedor),
      produtos: this.mapProdutoCompras(updatedNotaFiscal.produtos)
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.notaFiscalCompra.delete({
      where: { id },
    });
  }
}