import { PrismaClient } from '@prisma/client';
import { ICategoryRepository } from '../interfaces/repositories';
import { Category, Produto, FilterValues } from '../interfaces/entities';

export class CategoryRepositoryPrisma implements ICategoryRepository {
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
      estoques: produto.estoques,
      compras: produto.compras,
      vendas: produto.vendas
    };
  }

  private mapProdutos(produtos: any[]): Produto[] {
    return produtos ? produtos.map(this.mapProduto) : [];
  }

  async create(category: Omit<Category, 'id' | 'produtos'>): Promise<Category> {
    const createdCategory = await this.prisma.category.create({
      data: category,
      include: {
        produtos: {
          include: {
            categoria: true,
            estoques: true,
            compras: {
              include: {
                produto: true,
                notaFiscal: true
              }
            },
            vendas: {
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
      id: createdCategory.id,
      name: createdCategory.name,
      produtos: this.mapProdutos(createdCategory.produtos)
    };
  }

  async findById(id: number): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        produtos: {
          include: {
            categoria: true,
            estoques: true,
            compras: {
              include: {
                produto: true,
                notaFiscal: true
              }
            },
            vendas: {
              include: {
                produto: true,
                notaFiscal: true
              }
            }
          }
        }
      }
    });
    if (!category) return null;
    return {
      id: category.id,
      name: category.name,
      produtos: this.mapProdutos(category.produtos)
    };
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany();
    
    return categories.map(c => ({
      id: c.id,
      name: c.name,
    }));
  }

  async findPerPage(filters: FilterValues): Promise<{ categories: Category[], total: number }> {
      const { currentPage, itemsPerPage, search } = filters;
      const skip = (currentPage - 1) * itemsPerPage;
      const where: any = {};
  
      if (search) {
        where.name = { contains: search };
      }
  
      const categories = await this.prisma.category.findMany({
        where,
        skip,
        take: itemsPerPage
      });
  
      const total = await this.prisma.category.count();
      
      return {
        categories: categories,
        total
      };
    }

  async update(id: number, category: Partial<Omit<Category, 'id' | 'produtos'>>): Promise<Category> {
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: category,
      include: {
        produtos: {
          include: {
            categoria: true,
            estoques: true,
            compras: {
              include: {
                produto: true,
                notaFiscal: true
              }
            },
            vendas: {
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
      id: updatedCategory.id,
      name: updatedCategory.name,
      produtos: this.mapProdutos(updatedCategory.produtos)
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}