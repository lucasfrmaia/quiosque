import { PrismaClient } from '@prisma/client';
import { IProdutoEstoqueRepository, IProdutoRepository, IUserRepository, IGastoRepository, INotaFiscalRepository } from "./interfaces/repositories";
import { UserRepositoryPrisma } from './classes/UserRepositoryPrisma';
import { ProdutoEstoqueRepositoryPrisma } from './classes/ProdutoEstoqueRepositoryPrisma';
import { ProdutoRepositoryPrisma } from './classes/ProdutoRepositoryPrisma';
import { GastoRepositoryPrisma } from './classes/GastoRepositoryPrisma';
import { NotaFiscalRepositoryPrisma } from './classes/NotaFiscalRepositoryPrisma';

class RepositoryFactory {

    constructor(
        public readonly userRepository: IUserRepository,
        public readonly produtoEstoqueRepository: IProdutoEstoqueRepository,
        public readonly produtoRepository: IProdutoRepository,
        public readonly gastoRepository: IGastoRepository,
        public readonly notaFiscalRepository: INotaFiscalRepository
    ) {

    }
}

const prisma = new PrismaClient();

export const repositoryFactory = new RepositoryFactory(
    new UserRepositoryPrisma(prisma),
    new ProdutoEstoqueRepositoryPrisma(prisma),
    new ProdutoRepositoryPrisma(prisma),
    new GastoRepositoryPrisma(prisma),
    new NotaFiscalRepositoryPrisma(prisma)
);