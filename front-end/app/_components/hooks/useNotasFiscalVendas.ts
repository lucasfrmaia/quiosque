import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotaFiscalVenda, ProdutoVenda, FilterValues, SortDirection } from '@/types/interfaces/entities';

type FilterState = FilterValues;

interface UseNotasReturn {
  notas: NotaFiscalVenda[];
  total?: number;
  filters: FilterState;
  isLoading: boolean;
  error: unknown;
  handleCreate: (nota: Omit<NotaFiscalVenda, 'id' | 'produtos'> & { produtos: Omit<ProdutoVenda, 'id' | 'produto' | 'notaFiscal'>[] }) => void;
  handleEdit: (id: number, updates: Partial<Omit<NotaFiscalVenda, 'id' | 'produtos'>>) => void;
  handleDelete: (id: number) => void;
}

export const useNotasFiscaisVendas = (filters: FilterState): UseNotasReturn => {
  const queryClient = useQueryClient();

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', '1');
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

  const { data: response, isLoading, error } = useQuery<{ data: NotaFiscalVenda[]; total?: number }>({
    queryKey: ['notas', queryParams],
    queryFn: async () => {
      const response = await fetch(`/api/notas/findPerPage?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notas');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch notas');
      }
      return result;
    },
  });

  const notas = response?.data || [];
  const total = response?.total || 0;

  const createMutation = useMutation({
    mutationFn: async (nota: Omit<NotaFiscalVenda, 'id' | 'produtos'> & { produtos: Omit<ProdutoVenda, 'id' | 'produto' | 'notaFiscal'>[] }) => {
      const response = await fetch('/api/nota-fiscal-venda/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nota),
      });
      if (!response.ok) {
        throw new Error('Failed to create nota fiscal de venda');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create nota fiscal de venda');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas'] });
    },
  });

  const handleCreate = (nota: Omit<NotaFiscalVenda, 'id' | 'produtos'> & { produtos: Omit<ProdutoVenda, 'id' | 'produto' | 'notaFiscal'>[] }) => {
    createMutation.mutate(nota);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Omit<NotaFiscalVenda, 'id' | 'produtos'>> }) => {
      const response = await fetch(`/api/nota-fiscal-venda/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update nota fiscal de venda');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update nota fiscal de venda');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas'] });
    },
  });

  const handleEdit = (id: number, updates: Partial<Omit<NotaFiscalVenda, 'id' | 'produtos'>>) => {
    editMutation.mutate({ id, updates });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/nota-fiscal-venda/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete nota fiscal de venda');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete nota fiscal de venda');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas'] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return {
    notas,
    total,
    filters,
    isLoading,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};