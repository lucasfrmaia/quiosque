import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../interfaces/repositories';
import { User } from '../interfaces/entities';

export class UserRepositoryPrisma implements IUserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findPerPage(page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit;
    const users = await this.prisma.user.findMany({
      skip,
      take: limit
    });
    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      password: u.password
    }));
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: user,
    });
    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      password: createdUser.password
    };
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password
    };
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password
    }));
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: user,
    });
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.password
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}