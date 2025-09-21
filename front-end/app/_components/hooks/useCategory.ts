import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '@/types/interfaces/entities';

export const useCategory = () => {
  const queryClient = useQueryClient();

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
      console.log(id, updates)

      const response = await fetch(`/api/category/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

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
    handleCreate,
    handleEdit,
    handleDelete,
  };
};