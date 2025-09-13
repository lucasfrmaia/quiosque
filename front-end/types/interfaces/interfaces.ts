export interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao: string | null;
  notaFiscals?: NotaFiscal[];
  estoques?: Estoque[];
  cardapios?: Cardapio[];
}

export interface NotaFiscal {
  id: number;
  produtoId: number;
  quantidade: number;
  data: string;
  total: number;
  produtos?: Produto[];
}

export interface GastoDiario {
  id: number;
  descricao: string;
  valor: number;
  data: string;
}

export interface Estoque {
  id: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  categoria: string;
  dataValidade: string;
  produtoId: number;
  produto?: Produto;
}

export interface EstoqueItem {
  id: number;
  nome: string;
  quantidade: number;
  preco: number;
}

export interface Cardapio {
  id: number;
  produtoId: number;
  produto?: Produto;
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


export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
}
