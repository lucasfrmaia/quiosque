import { PrismaClient } from '@prisma/client';
import { IFornecedorRepository } from '../interfaces/repositories';
import { Fornecedor, NotaFiscalCompra, ProdutoCompra, Produto, FilterValues } from '../interfaces/entities';

export class FornecedorRepositoryPrisma implements IFornecedorRepository {
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

  private mapProdutoCompra(produtoCompra: any): ProdutoCompra {
    return {
      id: produtoCompra.id,
      notaFiscalId: produtoCompra.notaFiscalId,
      produtoId: produtoCompra.produtoId,
      quantidade: produtoCompra.quantidade,
      unidade: produtoCompra.unidade,
      precoUnitario: produtoCompra.precoUnitario,
      produto: this.mapProduto(produtoCompra.produto),
      notaFiscal: produtoCompra.notaFiscal ? {
        id: produtoCompra.notaFiscal.id,
        data: produtoCompra.notaFiscal.data.toISOString(),
        total: produtoCompra.notaFiscal.total,
        fornecedorId: produtoCompra.notaFiscal.fornecedorId,
        fornecedor: {
          id: produtoCompra.notaFiscal.fornecedor.id,
          nome: produtoCompra.notaFiscal.fornecedor.nome,
          cnpj: produtoCompra.notaFiscal.fornecedor.cnpj,
          telefone: produtoCompra.notaFiscal.fornecedor.telefone,
          email: produtoCompra.notaFiscal.fornecedor.email
        },
        produtos: []
      } : undefined
    };
  }

  private mapNotaFiscalCompra(notaFiscal: any): NotaFiscalCompra {
    return {
      id: notaFiscal.id,
      data: notaFiscal.data.toISOString(),
      total: notaFiscal.total,
      fornecedorId: notaFiscal.fornecedorId,
      fornecedor: {
        id: notaFiscal.fornecedor.id,
        nome: notaFiscal.fornecedor.nome,
        cnpj: notaFiscal.fornecedor.cnpj,
        telefone: notaFiscal.fornecedor.telefone,
        email: notaFiscal.fornecedor.email
      },
      produtos: notaFiscal.produtos ? notaFiscal.produtos.map(this.mapProdutoCompra) : []
    };
  }

  private mapCompras(compras: any[]): NotaFiscalCompra[] {
    return compras.map(this.mapNotaFiscalCompra);
  }

  async create(fornecedor: Omit<Fornecedor, 'id' | 'compras'>): Promise<Fornecedor> {
    const createdFornecedor = await this.prisma.fornecedor.create({
      data: fornecedor,
      include: {
        compras: {
          include: {
            produtos: {
              include: {
                produto: true,
                notaFiscal: true
              }
            }
          }
        }
      }
    });
    return {
      id: createdFornecedor.id,
      nome: createdFornecedor.nome,
      cnpj: createdFornecedor.cnpj,
      telefone: createdFornecedor.telefone,
      email: createdFornecedor.email,
      compras: this.mapCompras(createdFornecedor.compras)
    };
  }

  async findById(id: number): Promise<Fornecedor | null> {
    const fornecedor = await this.prisma.fornecedor.findUnique({
      where: { id },
      include: {
        compras: {
          include: {
            produtos: {
              include: {
                produto: true,
                notaFiscal: true
              }
            }
          }
        }
      }
    });
    if (!fornecedor) return null;
    return {
      id: fornecedor.id,
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      telefone: fornecedor.telefone,
      email: fornecedor.email,
      compras: this.mapCompras(fornecedor.compras)
    };
  }

  async findAll(): Promise<Fornecedor[]> {
    const fornecedores = await this.prisma.fornecedor.findMany({
      include: {
        compras: {
          include: {
            produtos: {
              include: {
                produto: true,
                notaFiscal: true
              }
            }
          }
        }
      }
    });
    return fornecedores.map(f => ({
      id: f.id,
      nome: f.nome,
      cnpj: f.cnpj,
      telefone: f.telefone,
      email: f.email,
      compras: this.mapCompras(f.compras)
    }));
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
        { telefone: { contains: search } }
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
      total
    };
  }

  async update(id: number, fornecedor: Partial<Omit<Fornecedor, 'id' | 'compras'>>): Promise<Fornecedor> {
    const updatedFornecedor = await this.prisma.fornecedor.update({
      where: { id },
      data: fornecedor
    });
    
    return {
      id: updatedFornecedor.id,
      nome: updatedFornecedor.nome,
      cnpj: updatedFornecedor.cnpj,
      telefone: updatedFornecedor.telefone,
      email: updatedFornecedor.email,
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.fornecedor.delete({
      where: { id }
    });
  }
}