import * as z from 'zod';

export const notaFiscalVendaSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  total: z.string().min(1, 'Total é obrigatório').refine((val) => !isNaN(Number(val)), 'Total deve ser um número'),
  produtos: z.array(z.object({
    id: z.string().optional(),
    produtoId: z.string().min(1, 'Produto é obrigatório'),
    quantidade: z.string().min(1, 'Quantidade é obrigatória').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Quantidade deve ser maior que 0'),
    unidade: z.string().optional(),
    precoUnitario: z.string().min(1, 'Preço unitário é obrigatório').refine((val) => !isNaN(Number(val)), 'Preço deve ser um número'),
    produtoNome: z.string().optional() // For display
  })).min(1, 'Pelo menos um produto é obrigatório')
});

export const categoriaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório')
});

export const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  preco: z.string().min(1, 'Preço é obrigatório').refine((val) => !isNaN(Number(val)), 'Preço deve ser um número'),
  categoriaId: z.string().min(1, 'Categoria é obrigatória')
});

export const fornecedorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  telefone: z.string().optional()
});

export const gastosSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.string().min(1, 'Valor é obrigatório').refine((val) => !isNaN(Number(val)), 'Valor deve ser um número'),
  data: z.string().min(1, 'Data é obrigatória'),
  categoria: z.string().optional()
});

export const notaFiscalCompraSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  total: z.string().min(1, 'Total é obrigatório').refine((val) => !isNaN(Number(val)), 'Total deve ser um número'),
  fornecedorId: z.string().min(1, 'Fornecedor é obrigatório'),
  unidade: z.string().optional(),
  produtos: z.array(z.object({
    produtoId: z.string().min(1, 'Produto é obrigatório'),
    quantidade: z.string().min(1, 'Quantidade é obrigatória').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Quantidade deve ser maior que 0'),
    unidade: z.string().min(1, 'Unidade é obrigatória'),
    precoUnitario: z.string().min(1, 'Preço unitário é obrigatório').refine((val) => !isNaN(Number(val)), 'Preço deve ser um número')
  })).min(1, 'Pelo menos um produto é obrigatório')
});

export const estoqueSchema = z.object({
  produtoId: z.string().min(1, 'Produto é obrigatório'),
  quantidade: z.string().min(1, 'Quantidade é obrigatória').refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Quantidade deve ser não negativa')
});


export type notaFiscalCompraSchema = z.infer<typeof notaFiscalCompraSchema>;

export type notaFiscalVendaSchema = z.infer<typeof notaFiscalVendaSchema>;