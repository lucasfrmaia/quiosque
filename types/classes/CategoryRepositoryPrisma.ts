import { PrismaClient } from '@prisma/client';
import { ICategoryRepository } from '../interfaces/repositories';
import { Category, Produto, FilterValues } from '../interfaces/entities';

export class CategoryRepositoryPrisma implements ICategoryRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(category: Omit<Category, 'id' | 'produtos'>): Promise<Category> {
    const createdCategory = await this.prisma.category.create({
      data: category,
    });

    return createdCategory;
  }

  async findById(id: number): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) return null;

    return category;
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany();

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
    }));
  }

  async findPerPage(filters: FilterValues): Promise<{ categories: Category[]; total: number }> {
    const { currentPage, itemsPerPage, search } = filters;
    const skip = (currentPage - 1) * itemsPerPage;
    const where: any = {};

    if (search) {
      where.name = { contains: search };
    }

    const categories = await this.prisma.category.findMany({
      where,
      skip,
      take: itemsPerPage,
    });

    const total = await this.prisma.category.count();

    return {
      categories: categories,
      total,
    };
  }

  async update(
    id: number,
    category: Partial<Omit<Category, 'id' | 'produtos'>>,
  ): Promise<Category> {
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: category,
    });

    return updatedCategory;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
