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
