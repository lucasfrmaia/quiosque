import { PrismaClient } from '@prisma/client';
import { IProdutoRepository } from '../interfaces/repositories';
import { Produto, Category, ProdutoEstoque, ProdutoCompra, ProdutoVenda, NotaFiscalCompra, NotaFiscalVenda, Fornecedor } from '../interfaces/entities';

export class ProdutoRepositoryPrisma implements IProdutoRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private mapCategoria(categoria: any): Category | undefined {
    if (!categoria) return undefined;
    return {
      id: categoria.id,
      name: categoria.name,
      produtos: [] // omit deep produtos to avoid circular
    };
  }

  private mapEstoque(estoque: any): ProdutoEstoque {
    return {
      id: estoque.id,
      preco: estoque.preco,
      quantidade: estoque.quantidade,
      dataValidade: estoque.dataValidade ? estoque.dataValidade.toISOString() : null,
      unidade: estoque.unidade,
      produtoId: estoque.produtoId,
      produto: { // basic produto
        id: estoque.produto.id,
        nome: estoque.produto.nome,
        descricao: estoque.produto.descricao,
        imagemUrl: estoque.produto.imagemUrl,
        ativo: estoque.produto.ativo,
        tipo: estoque.produto.tipo,
        categoriaId: estoque.produto.categoriaId
      }
    };
  }

  private mapEstoques(estoques: any[]): ProdutoEstoque[] {
    return estoques.map(this.mapEstoque);
  }

  private mapProdutoCompra(compra: any): ProdutoCompra {
    return {
      id: compra.id,
      notaFiscalId: compra.notaFiscalId,
      produtoId: compra.produtoId,
      quantidade: compra.quantidade,
      unidade: compra.unidade,
      precoUnitario: compra.precoUnitario,
      produto: { // basic
        id: compra.produto.id,
        nome: compra.produto.nome,
        descricao: compra.produto.descricao,
        imagemUrl: compra.produto.imagemUrl,
        ativo: compra.produto.ativo,
        tipo: compra.produto.tipo,
        categoriaId: compra.produto.categoriaId,
        categoria: this.mapCategoria(compra.produto.categoria),
        estoques: [],
        compras: [],
        vendas: []
      },
      notaFiscal: {
        id: compra.notaFiscal.id,
        data: compra.notaFiscal.data.toISOString(),
        total: compra.notaFiscal.total,
        fornecedorId: compra.notaFiscal.fornecedorId,
        fornecedor: { // basic
          id: compra.notaFiscal.fornecedor.id,
          nome: compra.notaFiscal.fornecedor.nome
        }
      }
    };
  }

  private mapCompras(compras: any[]): ProdutoCompra[] {
    return compras.map(this.mapProdutoCompra);
  }

  private mapProdutoVenda(venda: any): ProdutoVenda {
    return {
      id: venda.id,
      notaFiscalId: venda.notaFiscalId,
      produtoId: venda.produtoId,
      quantidade: venda.quantidade,
      unidade: venda.unidade,
      precoUnitario: venda.precoUnitario,
      produto: { // basic
        id: venda.produto.id,
        nome: venda.produto.nome,
        descricao: venda.produto.descricao,
        imagemUrl: venda.produto.imagemUrl,
        ativo: venda.produto.ativo,
        tipo: venda.produto.tipo,
        categoriaId: venda.produto.categoriaId,
        categoria: this.mapCategoria(venda.produto.categoria),
        estoques: [],
        compras: [],
        vendas: []
      },
      notaFiscal: {
        id: venda.notaFiscal.id,
        data: venda.notaFiscal.data.toISOString(),
        total: venda.notaFiscal.total
      }
    };
  }

  private mapVendas(vendas: any[]): ProdutoVenda[] {
    return vendas.map(this.mapProdutoVenda);
  }

  async create(produto: Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>): Promise<Produto> {
    const createdProduto = await this.prisma.produto.create({
      data: produto,
      include: {
        categoria: true,
        estoques: true,
        compras: {
          include: {
            produto: true,
            notaFiscal: {
              include: {
                fornecedor: true
              }
            }
          }
        },
        vendas: {
          include: {
            produto: true,
            notaFiscal: true
          }
        }
      }
    });
    return {
      id: createdProduto.id,
      nome: createdProduto.nome,
      descricao: createdProduto.descricao,
      imagemUrl: createdProduto.imagemUrl,
      ativo: createdProduto.ativo,
      tipo: createdProduto.tipo,
      categoriaId: createdProduto.categoriaId,
      categoria: this.mapCategoria(createdProduto.categoria),
      estoques: this.mapEstoques(createdProduto.estoques),
      compras: this.mapCompras(createdProduto.compras),
      vendas: this.mapVendas(createdProduto.vendas)
    };
  }

  async findById(id: number): Promise<Produto | null> {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        categoria: true,
        estoques: true,
        compras: {
          include: {
            produto: true,
            notaFiscal: {
              include: {
                fornecedor: true
              }
            }
          }
        },
        vendas: {
          include: {
            produto: true,
            notaFiscal: true
          }
        }
      }
    });
    if (!produto) return null;
    return {
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      imagemUrl: produto.imagemUrl,
      ativo: produto.ativo,
      tipo: produto.tipo,
      categoriaId: produto.categoriaId,
      categoria: this.mapCategoria(produto.categoria),
      estoques: this.mapEstoques(produto.estoques),
      compras: this.mapCompras(produto.compras),
      vendas: this.mapVendas(produto.vendas)
    };
  }

  async findAll(): Promise<Produto[]> {
    const produtos = await this.prisma.produto.findMany({
      include: {
        categoria: true,
        estoques: true,
        compras: {
          include: {
            produto: true,
            notaFiscal: {
              include: {
                fornecedor: true
              }
            }
          }
        },
        vendas: {
          include: {
            produto: true,
            notaFiscal: true
          }
        }
      }
    });
    return produtos.map(p => ({
      id: p.id,
      nome: p.nome,
      descricao: p.descricao,
      imagemUrl: p.imagemUrl,
      ativo: p.ativo,
      tipo: p.tipo,
      categoriaId: p.categoriaId,
      categoria: this.mapCategoria(p.categoria),
      estoques: this.mapEstoques(p.estoques),
      compras: this.mapCompras(p.compras),
      vendas: this.mapVendas(p.vendas)
    }));
  }

  async findPerPage(page: number, limit: number): Promise<Produto[]> {
    const skip = (page - 1) * limit;
    const produtos = await this.prisma.produto.findMany({
      skip,
      take: limit,
      include: {
        categoria: true,
        estoques: true,
        compras: {
          include: {
            produto: true,
            notaFiscal: {
              include: {
                fornecedor: true
              }
            }
          }
        },
        vendas: {
          include: {
            produto: true,
            notaFiscal: true
          }
        }
      }
    });
    return produtos.map(p => ({
      id: p.id,
      nome: p.nome,
      descricao: p.descricao,
      imagemUrl: p.imagemUrl,
      ativo: p.ativo,
      tipo: p.tipo,
      categoriaId: p.categoriaId,
      categoria: this.mapCategoria(p.categoria),
      estoques: this.mapEstoques(p.estoques),
      compras: this.mapCompras(p.compras),
      vendas: this.mapVendas(p.vendas)
    }));
  }

  async update(id: number, produto: Partial<Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>>): Promise<Produto> {
    const updatedProduto = await this.prisma.produto.update({
      where: { id },
      data: produto,
      include: {
        categoria: true,
        estoques: true,
        compras: {
          include: {
            produto: true,
            notaFiscal: {
              include: {
                fornecedor: true
              }
            }
          }
        },
        vendas: {
          include: {
            produto: true,
            notaFiscal: true
          }
        }
      }
    });
    return {
      id: updatedProduto.id,
      nome: updatedProduto.nome,
      descricao: updatedProduto.descricao,
      imagemUrl: updatedProduto.imagemUrl,
      ativo: updatedProduto.ativo,
      tipo: updatedProduto.tipo,
      categoriaId: updatedProduto.categoriaId,
      categoria: this.mapCategoria(updatedProduto.categoria),
      estoques: this.mapEstoques(updatedProduto.estoques),
      compras: this.mapCompras(updatedProduto.compras),
      vendas: this.mapVendas(updatedProduto.vendas)
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.produto.delete({
      where: { id },
    });
  }
}