import {
  User,
  Fornecedor,
  Category,
  Produto,
  ProdutoEstoque,
  NotaFiscalCompra,
  ProdutoCompra,
  NotaFiscalVenda,
  ProdutoVenda,
  FilterValues,
} from './entities';

export interface IUserRepository {
  create(user: Omit<User, 'id'>): Promise<User>;
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  findPerPage(filters: FilterValues): Promise<{ users: User[]; total: number }>;
  update(id: number, user: Partial<Omit<User, 'id'>>): Promise<User>;
  delete(id: number): Promise<void>;
}

export interface IFornecedorRepository {
  create(fornecedor: Omit<Fornecedor, 'id' | 'compras'>): Promise<Fornecedor>;
  findById(id: number): Promise<Fornecedor | null>;
  findAll(): Promise<Fornecedor[]>;
  findPerPage(filters: FilterValues): Promise<{ fornecedores: Fornecedor[]; total: number }>;
  update(id: number, fornecedor: Partial<Omit<Fornecedor, 'id' | 'compras'>>): Promise<Fornecedor>;
  delete(id: number): Promise<void>;
}

export interface ICategoryRepository {
  create(category: Omit<Category, 'id' | 'produtos'>): Promise<Category>;
  findById(id: number): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  findPerPage(filters: FilterValues): Promise<{ categories: Category[]; total: number }>;
  update(id: number, category: Partial<Omit<Category, 'id' | 'produtos'>>): Promise<Category>;
  delete(id: number): Promise<void>;
}

export interface IProdutoRepository {
  create(
    produto: Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>,
  ): Promise<Produto>;
  findById(id: number): Promise<Produto | null>;
  findAll(): Promise<Produto[]>;
  findPerPage(filters: FilterValues): Promise<{ produtos: Produto[]; total: number }>;
  update(
    id: number,
    produto: Partial<Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>>,
  ): Promise<Produto>;
  delete(id: number): Promise<void>;
}

export interface IProdutoEstoqueRepository {
  create(produtoEstoque: Omit<ProdutoEstoque, 'id' | 'produto'>): Promise<ProdutoEstoque>;
  findById(id: number): Promise<ProdutoEstoque | null>;
  findAll(): Promise<ProdutoEstoque[]>;
  findPerPage(filters: FilterValues): Promise<{ estoque: ProdutoEstoque[]; total: number }>;
  update(
    id: number,
    produtoEstoque: Partial<Omit<ProdutoEstoque, 'id' | 'produto'>>,
  ): Promise<ProdutoEstoque>;
  delete(id: number): Promise<void>;
}

export interface INotaFiscalCompraRepository {
  create(
    notaFiscal: Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'> & {
      produtos: Omit<ProdutoCompra, 'id' | 'produto' | 'notaFiscal'>[];
    },
  ): Promise<NotaFiscalCompra>;
  findById(id: number): Promise<NotaFiscalCompra | null>;
  findAll(): Promise<NotaFiscalCompra[]>;
  findPerPage(filters: FilterValues): Promise<{ notas: NotaFiscalCompra[]; total: number }>;
  update(
    id: number,
    notaFiscal: Partial<Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'>>,
  ): Promise<NotaFiscalCompra>;
  delete(id: number): Promise<void>;
}

export interface INotaFiscalVendaRepository {
  create(
    notaFiscal: Omit<NotaFiscalVenda, 'id' | 'produtos'> & {
      produtos: Omit<ProdutoVenda, 'id' | 'produto' | 'notaFiscal'>[];
    },
  ): Promise<NotaFiscalVenda>;
  findById(id: number): Promise<NotaFiscalVenda | null>;
  findAll(): Promise<NotaFiscalVenda[]>;
  findPerPage(filters: FilterValues): Promise<{ notas: NotaFiscalVenda[]; total: number }>;
  update(
    id: number,
    notaFiscal: Partial<Omit<NotaFiscalVenda, 'id' | 'produtos'>>,
  ): Promise<NotaFiscalVenda>;
  delete(id: number): Promise<void>;
}
