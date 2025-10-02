import { useQuery } from '@tanstack/react-query';

const RELATORIO_QUERY_KEY = 'relatorio';
const VENDAS_QUERY_KEY = 'relatorio-vendas';
const ESTOQUE_QUERY_KEY = 'relatorio-estoque';
const COMPRAS_QUERY_KEY = 'relatorio-compras';
const CONSOLIDADO_QUERY_KEY = 'relatorio-consolidado';

export const useRelatorio = () => {
  return useQuery({
    queryKey: [RELATORIO_QUERY_KEY],
    queryFn: async () => {
      const response = await fetch('/api/relatorio');
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do relatório');
      }
      return response.json();
    },
  });
};

// Sales Reports Hooks
export const useVendasPorPeriodo = (periodo: 'daily' | 'weekly' | 'monthly' | 'annual') => {
  return useQuery({
    queryKey: [VENDAS_QUERY_KEY, 'por-periodo', periodo],
    queryFn: async () => {
      const response = await fetch(`/api/relatorio/vendas?type=por-periodo&periodo=${periodo}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar vendas por período');
      }
      return response.json();
    },
  });
};

export const useComparativoPeriodos = (startDate1: string, endDate1: string, startDate2: string, endDate2: string) => {
  return useQuery({
    queryKey: [VENDAS_QUERY_KEY, 'comparativo-periodos', startDate1, endDate1, startDate2, endDate2],
    queryFn: async () => {
      const response = await fetch(`/api/relatorio/vendas?type=comparativo-periodos&startDate1=${startDate1}&endDate1=${endDate1}&startDate2=${startDate2}&endDate2=${endDate2}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar comparativo de períodos');
      }
      return response.json();
    },
    enabled: !!startDate1 && !!endDate1 && !!startDate2 && !!endDate2,
  });
};

export const useProdutosMaisVendidos = (limit: number = 10, by: 'quantidade' | 'faturamento' = 'faturamento') => {
  return useQuery({
    queryKey: [VENDAS_QUERY_KEY, 'produtos-mais-vendidos', limit, by],
    queryFn: async () => {
      const response = await fetch(`/api/relatorio/vendas?type=produtos-mais-vendidos&limit=${limit}&by=${by}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos mais vendidos');
      }
      return response.json();
    },
  });
};

export const useVendasPorCategoria = () => {
  return useQuery({
    queryKey: [VENDAS_QUERY_KEY, 'vendas-por-categoria'],
    queryFn: async () => {
      const response = await fetch('/api/relatorio/vendas?type=vendas-por-categoria');
      if (!response.ok) {
        throw new Error('Erro ao buscar vendas por categoria');
      }
      return response.json();
    },
  });
};

export const useMargemLucroPorProduto = (limit: number = 10) => {
  return useQuery({
    queryKey: [VENDAS_QUERY_KEY, 'margem-lucro', limit],
    queryFn: async () => {
      const response = await fetch(`/api/relatorio/vendas?type=margem-lucro&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar margem de lucro por produto');
      }
      return response.json();
    },
  });
};

// Stock Reports Hooks
export const usePosicaoEstoqueAtual = () => {
  return useQuery({
    queryKey: [ESTOQUE_QUERY_KEY, 'posicao-atual'],
    queryFn: async () => {
      const response = await fetch('/api/relatorio/estoque?type=posicao-atual');
      if (!response.ok) {
        throw new Error('Erro ao buscar posição de estoque atual');
      }
      return response.json();
    },
  });
};

export const useCurvaABCEstoque = () => {
  return useQuery({
    queryKey: [ESTOQUE_QUERY_KEY, 'curva-abc'],
    queryFn: async () => {
      const response = await fetch('/api/relatorio/estoque?type=curva-abc');
      if (!response.ok) {
        throw new Error('Erro ao buscar curva ABC de estoque');
      }
      return response.json();
    },
  });
};

export const useGiroEstoque = (periodo: 'monthly' | 'annual' = 'monthly') => {
  return useQuery({
    queryKey: [ESTOQUE_QUERY_KEY, 'giro', periodo],
    queryFn: async () => {
      const response = await fetch(`/api/relatorio/estoque?type=giro&periodo=${periodo}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar giro de estoque');
      }
      return response.json();
    },
  });
};

export const useProdutosBaixoEstoque = (minLevel: number = 10) => {
  return useQuery({
    queryKey: [ESTOQUE_QUERY_KEY, 'baixo-estoque', minLevel],
    queryFn: async () => {
      const response = await fetch(`/api/relatorio/estoque?type=baixo-estoque&minLevel=${minLevel}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos com baixo estoque');
      }
      return response.json();
    },
  });
};

export const useProdutosSemGiro = (days: number = 90) => {
  return useQuery({
    queryKey: [ESTOQUE_QUERY_KEY, 'sem-giro', days],
    queryFn: async () => {
      const response = await fetch(`/api/relatorio/estoque?type=sem-giro&days=${days}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos sem giro');
      }
      return response.json();
    },
  });
};

export const useProdutosProximaValidade = (days: number = 30) => {
  return useQuery({
    queryKey: [ESTOQUE_QUERY_KEY, 'proxima-validade', days],
    queryFn: async () => {
      const response = await fetch(`/api/relatorio/estoque?type=proxima-validade&days=${days}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos próximos da validade');
      }
      return response.json();
    },
  });
};

// Purchases Reports Hooks
export const useHistoricoComprasPorProduto = (produtoId: number) => {
  return useQuery({
    queryKey: [COMPRAS_QUERY_KEY, 'historico-produto', produtoId],
    queryFn: async () => {
      const response = await fetch(`/api/relatorio/compras?type=historico-produto&produtoId=${produtoId}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar histórico de compras por produto');
      }
      return response.json();
    },
    enabled: !!produtoId,
  });
};

export const useComprasPorFornecedor = () => {
  return useQuery({
    queryKey: [COMPRAS_QUERY_KEY, 'por-fornecedor'],
    queryFn: async () => {
      const response = await fetch('/api/relatorio/compras?type=por-fornecedor');
      if (!response.ok) {
        throw new Error('Erro ao buscar compras por fornecedor');
      }
      return response.json();
    },
  });
};

export const useCustosAquisiçãoPorProduto = (produtoId: number) => {
  return useQuery({
    queryKey: [COMPRAS_QUERY_KEY, 'custos-aquisicao', produtoId],
    queryFn: async () => {
      const response = await fetch(`/api/relatorio/compras?type=custos-aquisicao&produtoId=${produtoId}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar custos de aquisição por produto');
      }
      return response.json();
    },
    enabled: !!produtoId,
  });
};