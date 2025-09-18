import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Produto, FilterValues, SortDirection } from '@/types/interfaces/entities';

export const useProduto = (filters: FilterValues) => {
  const queryClient = useQueryClient();

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', filters.currentPage.toString());
    params.set('limit', filters.itemsPerPage.toString());
    params.set('sortField', filters.sortField);
    params.set('sortDirection', filters.sortDirection);
    if (filters.search) params.set('search', filters.search);
    if (filters.quantidadeMin) params.set('quantidadeMin', filters.quantidadeMin);
    if (filters.precoMax) params.set('precoMax', filters.precoMax);
    if (filters.precoMin) params.set('precoMin', filters.precoMin);
    if (filters.quantidadeMax) params.set('quantidadeMax', filters.quantidadeMax);
    return params.toString();
  }, [filters]);

  const { data: response, isLoading, error } = useQuery<{ data: Produto[]; total?: number }>({
    queryKey: ['produtos', queryParams],
    queryFn: async () => {
      const response = await fetch(`/api/produto/findPerPage?${queryParams}`);
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

  const produtos = response?.data || [];



  const createMutation = useMutation({
    mutationFn: async (produto: Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>) => {
      const response = await fetch('/api/produto/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });
      if (!response.ok) {
        throw new Error('Failed to create produto');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create produto');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });

  const handleCreate = (produto: Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>) => {
    createMutation.mutate(produto);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>> }) => {
      const response = await fetch(`/api/produto/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update produto');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update produto');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });

  const handleEdit = (id: number, updates: Partial<Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>>) => {
    editMutation.mutate({ id, updates });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/produto/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete produto');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete produto');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return {
    produtos,
    total: response?.total || 0,
    filters,
    isLoading,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};