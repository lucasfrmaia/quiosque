import { PrismaClient } from '@prisma/client';
import { IEstoqueRepository, IProdutoRepository, IUserRepository, IGastoRepository, INotaFiscalRepository } from "./interfaces/repositories";
import { UserRepositoryPrisma } from './classes/UserRepositoryPrisma';
import { EstoqueRepositoryPrisma } from './classes/EstoqueRepositoryPrisma';
import { ProdutoRepositoryPrisma } from './classes/ProdutoRepositoryPrisma';
import { GastoRepositoryPrisma } from './classes/GastoRepositoryPrisma';
import { NotaFiscalRepositoryPrisma } from './classes/NotaFiscalRepositoryPrisma';

class RepositoryFactory {

    constructor(
        public readonly userRepository: IUserRepository,
        public readonly estoqueRepository: IEstoqueRepository,
        public readonly produtoRepository: IProdutoRepository,
        public readonly gastoRepository: IGastoRepository,
        public readonly notaFiscalRepository: INotaFiscalRepository
    ) {

    }
}

const prisma = new PrismaClient();

export const repositoryFactory = new RepositoryFactory(
    new UserRepositoryPrisma(prisma),
    new EstoqueRepositoryPrisma(prisma),
    new ProdutoRepositoryPrisma(prisma),
    new GastoRepositoryPrisma(prisma),
    new NotaFiscalRepositoryPrisma(prisma)
);