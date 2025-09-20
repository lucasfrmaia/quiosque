import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category, FilterValues, SortDirection } from '@/types/interfaces/entities';

export const useCategory = (filters: FilterValues) => {
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

  const { data: response, isLoading, error } = useQuery<{ data: Category[]; total?: number }>({
    queryKey: ['categories', queryParams],
    queryFn: async () => {
      const response = await fetch(`/api/category/findPerPage?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch categories');
      }
      return result;
    },
  });

  const categories = response?.data || [];

  const createMutation = useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'produtos'>) => {
      const response = await fetch('/api/category/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create category');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleCreate = (category: Omit<Category, 'id' | 'produtos'>) => {
    createMutation.mutate(category);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Omit<Category, 'id' | 'produtos'>> }) => {
      const response = await fetch(`/api/category/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update category');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleEdit = (id: number, updates: Partial<Omit<Category, 'id' | 'produtos'>>) => {
    editMutation.mutate({ id, updates });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/category/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete category');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return {
    categories,
    total: response?.total || 0,
    filters,
    isLoading,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};