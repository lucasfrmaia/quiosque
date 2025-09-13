export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface Category {
  id: number;
  name: string;
  produtos?: Produto[];
}

export interface Produto {
  id: number;
  nome: string;
  categoriaId?: number | null;
  categoria?: Category;
  compras?: ProdutoCompra[];
}

export interface ProdutoEstoque {
  id: number;
  preco: number;
  quantidade: number;
  dataValidade: string;
  unidade: string;
  produtoId: number;
  estoqueId: number;
  tipo: string;
  notaFiscals?: NotaFiscal[];
}

export interface ProdutoCompra {
  id: number;
  produtoId: number;
  quantidade: number;
  unidade: string;
  preco: number;
  data: string;
  produto?: Produto;
}

export interface NotaFiscal {
  id: number;
  data: string;
  total: number;
  produtoId: number;
  produto?: ProdutoEstoque;
}

export type SortDirection = 'asc' | 'desc';

export interface FilterValues {
  search: string;
  quantidadeMin: string;
  quantidadeMax: string;
  precoMin: string;
  precoMax: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: SortDirection;
}
