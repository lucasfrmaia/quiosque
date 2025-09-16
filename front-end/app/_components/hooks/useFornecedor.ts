import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Fornecedor, FilterValues, SortDirection } from '@/types/interfaces/entities';

export const useFornecedor = () => {
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
    sortField: searchParams.get('sortField') || 'nome',
    sortDirection: (searchParams.get('sortDirection') || 'asc') as SortDirection,
  }), [searchParams]);

  const { data: fornecedores = [] } = useQuery<Fornecedor[]>({
    queryKey: ['fornecedores'],
    queryFn: async () => {
      const response = await fetch('/api/fornecedor/findAll');
      if (!response.ok) {
        throw new Error('Failed to fetch fornecedores');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch fornecedores');
      }
      return result.data;
    },
  });

  const filteredFornecedores = useMemo(() => {
    let filtered = [...(Array.isArray(fornecedores) ? fornecedores : [])];

    if (filterValues.search) {
      filtered = filtered.filter(f => f.nome.toLowerCase().includes(filterValues.search.toLowerCase()));
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
  }, [fornecedores, filterValues]);

  const paginatedFornecedores = useMemo(() => {
    const startIndex = (filterValues.currentPage - 1) * filterValues.itemsPerPage;
    const endIndex = startIndex + filterValues.itemsPerPage;
    return filteredFornecedores.slice(startIndex, endIndex);
  }, [filteredFornecedores, filterValues]);

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

  const handleReset = useCallback(() => {
    const params = new URLSearchParams();
    params.set('currentPage', '1');
    params.set('itemsPerPage', '10');
    params.set('sortField', 'nome');
    params.set('sortDirection', 'asc');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname]);

  return {
    fornecedores,
    paginatedFornecedores,
    filteredFornecedores,
    filterValues,
    handleSort,
    handleFilter,
    handleReset,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};