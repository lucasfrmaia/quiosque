import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Fornecedor, FilterValues, SortDirection } from '@/types/interfaces/entities';

export const useFornecedor = (filters: FilterValues) => {
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

  const { data: response, isLoading, error } = useQuery<{ data: Fornecedor[]; total?: number }>({
    queryKey: ['fornecedores', queryParams],
    queryFn: async () => {
      const response = await fetch(`/api/fornecedor/findPerPage?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch fornecedores');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch fornecedores');
      }
      return result;
    },
  });

  const fornecedores = response?.data || [];

  const createMutation = useMutation({
    mutationFn: async (fornecedor: Omit<Fornecedor, 'id' | 'compras'>) => {
      const response = await fetch('/api/fornecedor/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fornecedor),
      });
      if (!response.ok) {
        throw new Error('Failed to create fornecedor');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create fornecedor');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
    },
  });

  const handleCreate = (fornecedor: Omit<Fornecedor, 'id' | 'compras'>) => {
    createMutation.mutate(fornecedor);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Omit<Fornecedor, 'id' | 'compras'>> }) => {
      const response = await fetch(`/api/fornecedor/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update fornecedor');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update fornecedor');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
    },
  });

  const handleEdit = (id: number, updates: Partial<Omit<Fornecedor, 'id' | 'compras'>>) => {
    editMutation.mutate({ id, updates });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/fornecedor/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete fornecedor');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete fornecedor');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return {
    fornecedores,
    total: response?.total || 0,
    filters,
    isLoading,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};