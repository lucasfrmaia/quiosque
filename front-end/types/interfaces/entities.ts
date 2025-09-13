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
  notaFiscals?: ProdutoNotaFiscal[];
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
  produto?: Produto;
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
  produtos?: ProdutoNotaFiscal[];
}

export interface ProdutoNotaFiscal {
  id: number;
  produtoId: number;
  notaFiscalId: number;
  quantidade: number;
  unidade: string;
  preco: number;
  produto?: Produto;
  notaFiscal?: NotaFiscal;
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
