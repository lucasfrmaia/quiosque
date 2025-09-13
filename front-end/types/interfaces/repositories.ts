import { User, Produto, Estoque, Cardapio, GastoDiario, NotaFiscal } from './interfaces';

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
  create(produto: Omit<Produto, 'id' | 'notaFiscals' | 'estoques' | 'cardapios'>): Promise<Produto>;
  findById(id: number): Promise<Produto | null>;
  findAll(): Promise<Produto[]>;
  findPerPage(page: number, limit: number): Promise<Produto[]>;
  update(id: number, produto: Partial<Omit<Produto, 'id' | 'notaFiscals' | 'estoques' | 'cardapios'>>): Promise<Produto>;
  delete(id: number): Promise<void>;
}

export interface IEstoqueRepository {
  create(estoque: Omit<Estoque, 'id' | 'produto'>): Promise<Estoque>;
  findById(id: number): Promise<Estoque | null>;
  findAll(): Promise<Estoque[]>;
  findPerPage(page: number, limit: number): Promise<Estoque[]>;
  update(id: number, estoque: Partial<Omit<Estoque, 'id' | 'produto'>>): Promise<Estoque>;
  delete(id: number): Promise<void>;
}

export interface ICardapioRepository {
  create(cardapio: Omit<Cardapio, 'id' | 'produto'>): Promise<Cardapio>;
  findById(id: number): Promise<Cardapio | null>;
  findAll(): Promise<Cardapio[]>;
  findPerPage(page: number, limit: number): Promise<Cardapio[]>;
  update(id: number, cardapio: Partial<Omit<Cardapio, 'id' | 'produto'>>): Promise<Cardapio>;
  delete(id: number): Promise<void>;
}

export interface IGastoRepository {
  create(gasto: Omit<GastoDiario, 'id'>): Promise<GastoDiario>;
  findById(id: number): Promise<GastoDiario | null>;
  findAll(): Promise<GastoDiario[]>;
  findPerPage(page: number, limit: number): Promise<GastoDiario[]>;
  update(id: number, gasto: Partial<Omit<GastoDiario, 'id'>>): Promise<GastoDiario>;
  delete(id: number): Promise<void>;
}

export interface INotaFiscalRepository {
  findById(id: number): Promise<NotaFiscal | null>;
  findAll(): Promise<NotaFiscal[]>;
  findPerPage(page: number, limit: number): Promise<NotaFiscal[]>;
}