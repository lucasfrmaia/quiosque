export interface User {
  id: number;
  name: string;
  password: string;
}

export interface Fornecedor {
  id: number;
  nome: string;
  cnpj?: string | null;
  telefone?: string | null;
  email?: string | null;
  compras?: NotaFiscalCompra[];
}

export interface Category {
  id: number;
  name: string;
  produtos?: Produto[];
}

export type TipoProduto = 'INSUMO' | 'CARDAPIO';

export interface Produto {
  id: number;
  nome: string;
  descricao?: string | null;
  imagemUrl?: string | null;
  ativo: boolean;
  tipo: TipoProduto;
  categoriaId?: number | null;
  categoria?: Category;
  estoques?: ProdutoEstoque[];
  compras?: ProdutoCompra[];
  vendas?: ProdutoVenda[];
}

export interface ProdutoEstoque {
  id: number;
  preco: number;
  quantidade: number;
  dataValidade?: string | null;
  unidade: string;
  produtoId: number;
  produto?: Produto;
}

export interface NotaFiscalCompra {
  id: number;
  data: string;
  total: number;
  fornecedorId: number;
  fornecedor?: Fornecedor;
  produtos?: ProdutoCompra[];
}

export interface ProdutoCompra {
  id: number;
  notaFiscalId: number;
  produtoId: number;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
  produto?: Produto;
  notaFiscal?: NotaFiscalCompra;
}

export interface NotaFiscalVenda {
  id: number;
  data: string;
  total: number;
  produtos?: ProdutoVenda[];
}

export interface ProdutoVenda {
  id: number;
  notaFiscalId: number;
  produtoId: number;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
  produto?: Produto;
  notaFiscal?: NotaFiscalVenda;
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
