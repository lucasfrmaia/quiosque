import { User, Produto, ProdutoEstoque, ProdutoCompra, NotaFiscal, Category } from './entities';

export interface IUserRepository {
  create(user: Omit<User, 'id'>): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findPerPage(page: number, limit: number): Promise<User[]>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
}

export interface IProdutoRepository {
  create(produto: Omit<Produto, 'id' | 'categoria' | 'compras'>): Promise<Produto>;
  findById(id: number): Promise<Produto | null>;
  findAll(): Promise<Produto[]>;
  findPerPage(page: number, limit: number): Promise<Produto[]>;
  update(id: number, produto: Partial<Omit<Produto, 'id' | 'categoria' | 'compras'>>): Promise<Produto>;
  delete(id: number): Promise<void>;
}

export interface IProdutoEstoqueRepository {
  create(produtoEstoque: Omit<ProdutoEstoque, 'id' | 'notaFiscals'>): Promise<ProdutoEstoque>;
  findById(id: number): Promise<ProdutoEstoque | null>;
  findAll(): Promise<ProdutoEstoque[]>;
  findPerPage(page: number, limit: number): Promise<ProdutoEstoque[]>;
  update(id: number, produtoEstoque: Partial<Omit<ProdutoEstoque, 'id' | 'notaFiscals'>>): Promise<ProdutoEstoque>;
  delete(id: number): Promise<void>;
}

export interface IGastoRepository {
  create(gasto: Omit<ProdutoCompra, 'id' | 'produto'>): Promise<ProdutoCompra>;
  findById(id: number): Promise<ProdutoCompra | null>;
  findAll(): Promise<ProdutoCompra[]>;
  findPerPage(page: number, limit: number): Promise<ProdutoCompra[]>;
  update(id: number, gasto: Partial<Omit<ProdutoCompra, 'id' | 'produto'>>): Promise<ProdutoCompra>;
  delete(id: number): Promise<void>;
}

export interface INotaFiscalRepository {
  findById(id: number): Promise<NotaFiscal | null>;
  findAll(): Promise<NotaFiscal[]>;
  findPerPage(page: number, limit: number): Promise<NotaFiscal[]>;
}

export interface ICategoryRepository {
  create(category: Omit<Category, 'id' | 'produtos'>): Promise<Category>;
  findById(id: number): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  findPerPage(page: number, limit: number): Promise<Category[]>;
  update(id: number, category: Partial<Omit<Category, 'id' | 'produtos'>>): Promise<Category>;
  delete(id: number): Promise<void>;
}