import { User } from './interfaces';
import { Produto } from './interfaces';
import { ItemEstoque } from './interfaces';

export interface IUserRepository {
  create(user: Omit<User, 'id'>): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
}

export interface IProdutoRepository {
  create(produto: Omit<Produto, 'id'>): Promise<Produto>;
  findById(id: number): Promise<Produto | null>;
  findAll(): Promise<Produto[]>;
  update(id: number, produto: Partial<Produto>): Promise<Produto>;
  delete(id: number): Promise<void>;
}

export interface IEstoqueRepository {
  create(estoque: Omit<ItemEstoque, 'id'>): Promise<ItemEstoque>;
  findById(id: number): Promise<ItemEstoque | null>;
  findAll(): Promise<ItemEstoque[]>;
  update(id: number, estoque: Partial<ItemEstoque>): Promise<ItemEstoque>;
  delete(id: number): Promise<void>;
}