import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { NotaFiscalCompra, ProdutoCompra, FilterValues, SortDirection } from '@/types/interfaces/entities';

export const useNotaFiscalCompra = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filterValues = useMemo<FilterValues>(() => ({
    search: searchParams.get('search') || '',
    quantidadeMin: searchParams.get('quantidadeMin') || '',
    quantidadeMax: searchParams.get('quantidadeMax') || '',
    precoMin: searchParams.get('precoMin') || '',
    precoMax: searchParams.get('precoMax') || '',
    currentPage: parseInt(searchParams.get('currentPage') || '1', 10),
    itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '10', 10),
    sortField: searchParams.get('sortField') || 'data',
    sortDirection: (searchParams.get('sortDirection') || 'desc') as SortDirection,
  }), [searchParams]);

  const { data: notas = [] } = useQuery<NotaFiscalCompra[]>({
    queryKey: ['notaFiscalCompra'],
    queryFn: async () => {
      const response = await fetch('/api/nota-fiscal-compra/findAll');
      if (!response.ok) {
        throw new Error('Failed to fetch notas fiscais de compra');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch notas fiscais de compra');
      }
      return result.data;
    },
  });

  const filteredNotas = useMemo(() => {
    let filtered = [...(Array.isArray(notas) ? notas : [])];

    if (filterValues.search) {
      filtered = filtered.filter(n => n.id.toString().includes(filterValues.search));
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = (a as any)[filterValues.sortField];
      const bValue = (b as any)[filterValues.sortField];
      if (aValue < bValue) return filterValues.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return filterValues.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [notas, filterValues]);

  const paginatedNotas = useMemo(() => {
    const startIndex = (filterValues.currentPage - 1) * filterValues.itemsPerPage;
    const endIndex = startIndex + filterValues.itemsPerPage;
    return filteredNotas.slice(startIndex, endIndex);
  }, [filteredNotas, filterValues]);

  const handleFilter = useCallback((newFilters: Partial<FilterValues>) => {
    const params = new URLSearchParams(searchParams.toString());
    const isPaginationChange = 'currentPage' in newFilters || 'itemsPerPage' in newFilters;

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === '' || value === undefined || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if (!isPaginationChange) {
      params.set('currentPage', '1');
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const handleSort = useCallback((field: string) => {
    const direction = filterValues.sortField === field && filterValues.sortDirection === 'asc' ? 'desc' : 'asc';
    handleFilter({ sortField: field, sortDirection: direction, currentPage: 1 });
  }, [filterValues.sortField, filterValues.sortDirection, handleFilter]);

  const createMutation = useMutation({
    mutationFn: async (nota: Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'> & { produtos: Omit<ProdutoCompra, 'id' | 'produto' | 'notaFiscal'>[] }) => {
      const response = await fetch('/api/nota-fiscal-compra/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nota),
      });
      if (!response.ok) {
        throw new Error('Failed to create nota fiscal de compra');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create nota fiscal de compra');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notaFiscalCompra'] });
    },
  });

  const handleCreate = (nota: Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'> & { produtos: Omit<ProdutoCompra, 'id' | 'produto' | 'notaFiscal'>[] }) => {
    createMutation.mutate(nota);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'>> }) => {
      const response = await fetch(`/api/nota-fiscal-compra/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update nota fiscal de compra');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update nota fiscal de compra');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notaFiscalCompra'] });
    },
  });

  const handleEdit = (id: number, updates: Partial<Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'>>) => {
    editMutation.mutate({ id, updates });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/nota-fiscal-compra/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete nota fiscal de compra');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete nota fiscal de compra');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notaFiscalCompra'] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleReset = useCallback(() => {
    const params = new URLSearchParams();
    params.set('currentPage', '1');
    params.set('itemsPerPage', '10');
    params.set('sortField', 'data');
    params.set('sortDirection', 'desc');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname]);

  return {
    notas,
    paginatedNotas,
    filteredNotas,
    filterValues,
    handleSort,
    handleFilter,
    handleReset,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};