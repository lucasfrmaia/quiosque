import { PrismaClient } from '@prisma/client';
import { ICategoryRepository } from '../interfaces/repositories';
import { Category } from '../interfaces/entities';

export class CategoryRepositoryPrisma implements ICategoryRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private mapProdutos(produtos: any[]): any[] {
    // Map produtos if needed, but for Category, produtos is optional
    return produtos || [];
  }

  async create(category: Omit<Category, 'id' | 'produtos'>): Promise<Category> {
    const createdCategory = await this.prisma.category.create({
      data: category,
      include: {
        produtos: true
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
        produtos: true
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
    const categories = await this.prisma.category.findMany({
      include: {
        produtos: true
      }
    });
    return categories.map(c => ({
      id: c.id,
      name: c.name,
      produtos: this.mapProdutos(c.produtos)
    }));
  }

  async findPerPage(page: number, limit: number): Promise<Category[]> {
    const skip = (page - 1) * limit;
    const categories = await this.prisma.category.findMany({
      skip,
      take: limit,
      include: {
        produtos: true
      }
    });
    return categories.map(c => ({
      id: c.id,
      name: c.name,
      produtos: this.mapProdutos(c.produtos)
    }));
  }

  async update(id: number, category: Partial<Omit<Category, 'id' | 'produtos'>>): Promise<Category> {
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: category,
      include: {
        produtos: true
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