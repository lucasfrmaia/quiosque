import {
  Category,
  Fornecedor,
  NotaFiscalCompra,
  NotaFiscalVenda,
  Produto,
  ProdutoCompra,
  ProdutoEstoque,
  ProdutoVenda,
} from "../interfaces/entities";

export type ProdutoVendaCreate = Omit<
  ProdutoVenda,
  "id" | "produto" | "notaFiscal" | "notaFiscalId"
>;

export type NotaFiscalCreatePayload = Omit<
  NotaFiscalVenda,
  "id" | "produtos"
> & {
  produtos: ProdutoVendaCreate[];
};

export type NotaFiscalEditPayload = {
  id: number;
  updates: Partial<Omit<NotaFiscalVenda, "id" | "produtos">>;
};

export type ProdutoCompraCreate = Omit<
  ProdutoCompra,
  "id" | "produto" | "notaFiscal"
>;

export type NotaFiscalCompraCreatePayload = Omit<
  NotaFiscalCompra,
  "id" | "fornecedor" | "produtos"
> & {
  produtos: ProdutoCompraCreate[];
};

export type NotaFiscalCompraEditPayload = {
  id: number;
  updates: Partial<Omit<NotaFiscalCompra, "id" | "fornecedor" | "produtos">>;
};

export type ProdutoNotaCompraInput = Omit<
  ProdutoCompra,
  "id" | "produto" | "notaFiscal" | "notaFiscalId"
>;

export type NotaFiscalCompraCreationData = Omit<
  NotaFiscalCompra,
  "id" | "fornecedor" | "produtos"
> & {
  produtos: ProdutoNotaCompraInput[];
};

export type NotaFiscalCompraUpdateData = {
  id: number;
  updates: Partial<Omit<NotaFiscalCompra, "id" | "fornecedor" | "produtos">>;
};

export type FornecedorCreationInput = Omit<Fornecedor, "id" | "compras">;

export type FornecedorUpdateInput = {
  id: number;
  updates: Partial<Omit<Fornecedor, "id" | "compras">>;
};

export type ProdutoInsertData = Omit<
  Produto,
  "id" | "categoria" | "estoques" | "compras" | "vendas" | "categoriaId"
> & { categoriaId: string | undefined };

export type ProdutoPatchData = {
  id: number;
  updates: Partial<
    Omit<
      Produto,
      "id" | "categoria" | "estoques" | "compras" | "vendas" | "categoriaId"
    >
  > & { categoriaId: string | undefined };
};

export type EstoqueNewData = Omit<ProdutoEstoque, "id" | "produto">;

export type EstoqueUpdatePayload = {
  id: number;
  updates: Partial<Omit<ProdutoEstoque, "id" | "produto">>;
};

export type CategoryNewData = Omit<Category, "id" | "produtos">;
export type CategoryUpdateData = {
  id: number;
  updates: Partial<Omit<Category, "id" | "produtos">>;
};
