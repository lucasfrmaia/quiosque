import { PrismaClient } from '@prisma/client';
import { ICardapioRepository, IEstoqueRepository, IProdutoRepository, IUserRepository } from "./interfaces/repositories";
import { UserRepositoryPrisma } from './classes/UserRepositoryPrisma';
import { EstoqueRepositoryPrisma } from './classes/EstoqueRepositoryPrisma';
import { ProdutoRepositoryPrisma } from './classes/ProdutoRepositoryPrisma';
import { CardapioRepositoryPrisma } from './classes/CardapioRepositoryPrisma';

class RepositoryFactory {

    constructor(
        public readonly userRepository: IUserRepository,
        public readonly estoqueRepository: IEstoqueRepository,
        public readonly cardapioRepository: ICardapioRepository,
        public readonly produtoRepository: IProdutoRepository
    ) {

    }
}

const prisma = new PrismaClient();

export const repositoryFactory = new RepositoryFactory(
    new UserRepositoryPrisma(prisma),
    new EstoqueRepositoryPrisma(prisma),
    new CardapioRepositoryPrisma(prisma),
    new ProdutoRepositoryPrisma(prisma)
);