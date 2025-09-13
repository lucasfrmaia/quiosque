import { PrismaClient } from "@prisma/client";
import { ICardapioRepository } from "../interfaces/repositories";
import { Cardapio } from "../interfaces/interfaces";


export class CardapioRepositoryPrisma implements ICardapioRepository {

    constructor(private prisma: PrismaClient) { }

    async create(cardapio: Omit<Cardapio, "id" | "produto">): Promise<Cardapio> {
        const created = await this.prisma.cardapio.create({
            data: cardapio,
            include: { produto: true }
        });
        return {
            id: created.id,
            produtoId: created.produtoId,
            produto: created.produto
        };
    }
    async findById(id: number): Promise<Cardapio | null> {
        const cardapio = await this.prisma.cardapio.findUnique({
            where: { id },
            include: { produto: true }
        });
        if (!cardapio) return null;
        return {
            id: cardapio.id,
            produtoId: cardapio.produtoId,
            produto: cardapio.produto
        };
    }
    async findAll(): Promise<Cardapio[]> {
        const cardapios = await this.prisma.cardapio.findMany({
            include: { produto: true }
        });
        return cardapios.map(c => ({
            id: c.id,
            produtoId: c.produtoId,
            produto: c.produto
        }));
    }
    async findPerPage(page: number, limit: number): Promise<Cardapio[]> {
        const skip = (page - 1) * limit;
        const cardapios = await this.prisma.cardapio.findMany({
            skip,
            take: limit,
            include: { produto: true }
        });
        return cardapios.map(c => ({
            id: c.id,
            produtoId: c.produtoId,
            produto: c.produto
        }));
    }
    async update(id: number, cardapio: Partial<Omit<Cardapio, "id" | "produto">>): Promise<Cardapio> {
        const updated = await this.prisma.cardapio.update({
            where: { id },
            data: cardapio,
            include: { produto: true }
        });
        return {
            id: updated.id,
            produtoId: updated.produtoId,
            produto: updated.produto
        };
    }
    async delete(id: number): Promise<void> {
        await this.prisma.cardapio.delete({
            where: { id }
        });
    }

}