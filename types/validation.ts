import { z } from 'zod';

export const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  descricao: z.string().max(255, 'Descrição deve ter no máximo 255 caracteres').optional(),
  imagemUrl: z.string().max(255, 'URL muito longa').optional(),
  ativo: z.boolean(),
  tipo: z.enum(['INSUMO', 'CARDAPIO'], { error: 'Selecione um Tipo!' }),
  categoriaId: z.number().int().positive().max(999999, 'ID de categoria inválido').optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
});

export const fornecedorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  cnpj: z.string().max(18, 'CNPJ inválido').optional(),
  telefone: z.string().max(20, 'Telefone inválido').optional(),
  email: z.email({ message: 'E-mail inválido' }).max(150, 'E-mail muito longo'),
});

export const produtoEstoqueSchema = z.object({
  preco: z.number().min(0, 'Preço deve ser positivo').max(999999, 'Preço muito alto'),
  quantidade: z
    .number()
    .min(0, 'Quantidade deve ser positiva')
    .max(1000000, 'Quantidade muito alta'),
  dataValidade: z.date({ message: 'Escolha uma Data!' }).optional(),
  unidade: z.enum(['UNIDADE', 'KG', 'MG']).optional(),
  produtoId: z.number({ message: 'Escolha um Produto!' }).int().positive(),
});

export const notaFiscalCompraSchema = z.object({
  data: z.date({ message: 'Escolha uma Data!' }),
  fornecedorId: z.number({ message: 'Selecione um Fornecedor!' }).int().positive(),
  produtos: z
    .array(
      z.object({
        produtoId: z.number().int().positive(),
        quantidade: z
          .number()
          .positive()
          .min(0, 'Quantidade deve ser positiva')
          .max(100000, 'Quantidade muito alta'),
        unidade: z.enum(['UNIDADE', 'KG', 'MG']).optional(),
        precoUnitario: z
          .number()
          .positive()
          .min(0, 'Preço unitário deve ser positivo')
          .max(999999, 'Preço unitário muito alto'),
      }),
    )
    .min(1, 'Pelo menos um produto é obrigatório'),
});

export const notaFiscalVendaSchema = z.object({
  data: z.date({ message: 'Escolha uma Data!' }),
  total: z.number().min(0, 'Total deve ser positivo').max(999999999, 'Total muito alto'),
  produtos: z
    .array(
      z.object({
        produtoId: z.number().int().positive(),
        quantidade: z
          .number()
          .min(1, 'Quantidade deve ser positiva')
          .max(100000, 'Quantidade muito alta'),
        precoUnitario: z
          .number()
          .min(0, 'Preço unitário deve ser positivo')
          .max(999999, 'Preço unitário muito alto'),
      }),
    )
    .min(1, 'Pelo menos um produto é obrigatório'),
});

export type NotaFiscalCompraSchema = z.infer<typeof notaFiscalCompraSchema>;
export type NotaFiscalVendaSchema = z.infer<typeof notaFiscalVendaSchema>;
export type CategorySchema = z.infer<typeof categorySchema>;
export type ProdutoSchema = z.infer<typeof produtoSchema>;
export type EstoqueSchema = z.infer<typeof produtoEstoqueSchema>;
export type FornecedorSchema = z.infer<typeof fornecedorSchema>;
