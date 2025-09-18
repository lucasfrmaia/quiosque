import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProdutoEstoque, FilterValues, SortDirection, Produto } from '@/types/interfaces/entities';

type FilterState = FilterValues;

interface UseEstoqueReturn {
  estoque: ProdutoEstoque[];
  produtos: Produto[];
  filters: FilterState;
  isLoading: boolean;
  error: unknown;
  total: number;
  handleCreate: (estoque: Omit<ProdutoEstoque, 'id' | 'produto'>) => void;
  handleEdit: (id: number, updates: Partial<Omit<ProdutoEstoque, 'id' | 'produto'>>) => void;
  handleDelete: (id: number) => void;
}

export const useEstoque = (filters: FilterState): UseEstoqueReturn => {
  const queryClient = useQueryClient();

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', filters.currentPage.toString());
    params.set('limit', filters.itemsPerPage.toString());
    params.set('sortField', filters.sortField);
    params.set('sortDirection', filters.sortDirection);
    if (filters.search) params.set('search', filters.search);
    if (filters.quantidadeMin) params.set('quantidadeMin', filters.quantidadeMin);
    if (filters.quantidadeMax) params.set('quantidadeMax', filters.quantidadeMax);
    if (filters.precoMin) params.set('precoMin', filters.precoMin);
    if (filters.precoMax) params.set('precoMax', filters.precoMax);
    return params.toString();
  }, [filters]);

  const { data: response, isLoading, error } = useQuery<{ data: ProdutoEstoque[]; total?: number }>({
    queryKey: ['estoque', queryParams],
    queryFn: async () => {
      const response = await fetch(`/api/estoque/findPerPage?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch estoque');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch estoque');
      }
      return result;
    },
  });

  const estoque = response?.data || [];

  const produtosQueryParams = useMemo(() => new URLSearchParams({
    page: '1',
    limit: '1000',
  }).toString(), []);

  const { data: produtosResponse, isLoading: isLoadingProdutos, error: errorProdutos } = useQuery<{ data: Produto[]; total?: number }>({
    queryKey: ['produtos', produtosQueryParams],
    queryFn: async () => {
      const response = await fetch(`/api/produto/findPerPage?${produtosQueryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch produtos');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch produtos');
      }
      return result;
    },
  });

  const produtos = produtosResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: async (estoque: Omit<ProdutoEstoque, 'id' | 'produto'>) => {
      const response = await fetch('/api/estoque/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estoque),
      });
      if (!response.ok) {
        throw new Error('Failed to create estoque');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create estoque');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estoque'] });
    },
  });

  const handleCreate = (estoque: Omit<ProdutoEstoque, 'id' | 'produto'>) => {
    createMutation.mutate(estoque);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Omit<ProdutoEstoque, 'id' | 'produto'>> }) => {
      const response = await fetch(`/api/estoque/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update estoque');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update estoque');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estoque'] });
    },
  });

  const handleEdit = (id: number, updates: Partial<Omit<ProdutoEstoque, 'id' | 'produto'>>) => {
    editMutation.mutate({ id, updates });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/estoque/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete estoque');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete estoque');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estoque'] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return {
    estoque,
    total: response?.total || 0,
    produtos,
    filters,
    isLoading,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};