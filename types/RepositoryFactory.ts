import { PrismaClient } from '@prisma/client';
import { IProdutoEstoqueRepository, IProdutoRepository, IUserRepository, INotaFiscalCompraRepository, INotaFiscalVendaRepository, ICategoryRepository, IFornecedorRepository } from "./interfaces/repositories";
import { UserRepositoryPrisma } from './classes/UserRepositoryPrisma';
import { ProdutoEstoqueRepositoryPrisma } from './classes/ProdutoEstoqueRepositoryPrisma';
import { ProdutoRepositoryPrisma } from './classes/ProdutoRepositoryPrisma';
import { NotaFiscalCompraRepositoryPrisma } from './classes/NotaFiscalCompraRepositoryPrisma';
import { NotaFiscalVendaRepositoryPrisma } from './classes/NotaFiscalVendaRepositoryPrisma';
import { CategoryRepositoryPrisma } from './classes/CategoryRepositoryPrisma';
import { FornecedorRepositoryPrisma } from './classes/FornecedorRepositoryPrisma';
import { Relatorio } from './classes/Relatorio';

class RepositoryFactory {
  constructor(
    public readonly userRepository: IUserRepository,
    public readonly produtoEstoqueRepository: IProdutoEstoqueRepository,
    public readonly produtoRepository: IProdutoRepository,
    public readonly notaFiscalCompraRepository: INotaFiscalCompraRepository,
    public readonly notaFiscalVendaRepository: INotaFiscalVendaRepository,
    public readonly categoryRepository: ICategoryRepository,
    public readonly fornecedorRepository: IFornecedorRepository,
    public readonly relatorio: Relatorio
  ) {
  }
}

const prisma = new PrismaClient();

export const repositoryFactory = new RepositoryFactory(
  new UserRepositoryPrisma(prisma),
  new ProdutoEstoqueRepositoryPrisma(prisma),
  new ProdutoRepositoryPrisma(prisma),
  new NotaFiscalCompraRepositoryPrisma(prisma),
  new NotaFiscalVendaRepositoryPrisma(prisma),
  new CategoryRepositoryPrisma(prisma),
  new FornecedorRepositoryPrisma(prisma),
  new Relatorio(prisma)
);