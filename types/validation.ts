import { z } from 'zod';

export const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  imagemUrl: z.string().optional(),
  ativo: z.boolean(),
  tipo: z.enum(['INSUMO', 'CARDAPIO']),
  categoriaId: z.number().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
});

export const fornecedorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().optional(),
  telefone: z.string().optional(),
  email: z.email({ error: "E-mail Inválido"}).optional(),
});

export const produtoEstoqueSchema = z.object({
  preco: z.number().min(0, 'Preço deve ser positivo'),
  quantidade: z.number().min(0, 'Quantidade deve ser positiva'),
  dataValidade: z.date().optional(),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
  produtoId: z.number(),
});

export const notaFiscalCompraSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  fornecedorId: z.number(),
  produtos: z.array(z.object({
    produtoId: z.number(),
    quantidade: z.number().positive().min(1, 'Quantidade deve ser positiva'),
    unidade: z.string().min(1, 'Unidade é obrigatória'),
    precoUnitario: z.float32().positive().min(0, 'Preço unitário deve ser positivo'),
  })).min(1, 'Pelo menos um produto é obrigatório'),
});

export const notaFiscalVendaSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  total: z.number().min(0, 'Total deve ser positivo'),
  produtos: z.array(z.object({
    produtoId: z.number(),
    quantidade: z.number().min(1, 'Quantidade deve ser positiva'),
    unidade: z.string().min(1, 'Unidade é obrigatória'),
    precoUnitario: z.number().min(0, 'Preço unitário deve ser positivo'),
  })).min(1, 'Pelo menos um produto é obrigatório'),
});

export type NotaFiscalCompraSchema = z.infer<typeof notaFiscalCompraSchema>;

export type NotaFiscalVendaSchema = z.infer<typeof notaFiscalVendaSchema>;

export type CategorySchema = z.infer<typeof categorySchema>

export type ProdutoSchema = z.infer<typeof produtoSchema>

export type EstoqueSchema = z.infer<typeof produtoEstoqueSchema>

export type FornecedorSchema = z.infer<typeof fornecedorSchema>