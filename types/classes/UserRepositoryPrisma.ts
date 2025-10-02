import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../interfaces/repositories';
import { User, FilterValues } from '../interfaces/entities';

export class UserRepositoryPrisma implements IUserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: user
    });

    return createdUser;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findPerPage(filters: FilterValues) {
    const { currentPage, itemsPerPage, search } = filters;
    const skip = (currentPage - 1) * itemsPerPage;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      skip,
      take: itemsPerPage
    });

    const total = await this.prisma.user.count();

    return {
      users,
      total
    };
  }

  async update(id: number, user: Partial<Omit<User, 'id'>>): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: user
    });

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }
}