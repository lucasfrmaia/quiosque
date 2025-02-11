export interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
}

export interface NotaFiscal {
  id: number;
  produtoId: number;
  quantidade: number;
  data: string;
  total: number;
}

export interface GastoDiario {
  id: number;
  descricao: string;
  valor: number;
  data: string;
}

export interface ItemEstoque {
  id: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  categoria: string;
  dataValidade?: string;
}

export interface EstoqueItem {
  id: number;
  nome: string;
  quantidade: number;
  preco: number;
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
