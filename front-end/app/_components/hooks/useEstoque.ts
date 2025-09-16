import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { ProdutoEstoque, FilterValues, SortDirection, Produto } from '@/types/interfaces/entities';

type FilterState = FilterValues;

interface UseEstoqueReturn {
  estoque: ProdutoEstoque[];
  produtos: Produto[];
  filteredEstoque: ProdutoEstoque[];
  paginatedEstoque: ProdutoEstoque[];
  filterValues: FilterState;
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<FilterState>) => void;
  handleCreate: (estoque: Omit<ProdutoEstoque, 'id' | 'produto'>) => void;
  handleEdit: (id: number, updates: Partial<Omit<ProdutoEstoque, 'id' | 'produto'>>) => void;
  handleDelete: (id: number) => void;
}

export const useEstoque = (): UseEstoqueReturn => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const appliedFilters = useMemo<FilterState>(() => ({
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

  const { data: estoque = [], isLoading, error } = useQuery<ProdutoEstoque[]>({
    queryKey: ['estoque'],
    queryFn: async () => {
      const response = await fetch('/api/estoque/findAll');
      if (!response.ok) {
        throw new Error('Failed to fetch estoque');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch estoque');
      }
      return result.data;
    },
  });

  const { data: produtos = [] } = useQuery<Produto[]>({
    queryKey: ['produtos'],
    queryFn: async () => {
      const response = await fetch('/api/produto/findAll');
      if (!response.ok) {
        throw new Error('Failed to fetch produtos');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch produtos');
      }
      return result.data;
    },
  });

  const handleSort = useCallback((field: string) => {
    const newDirection = appliedFilters.sortField === field && appliedFilters.sortDirection === 'asc' ? 'desc' : 'asc';
    handleFilter({ sortField: field, sortDirection: newDirection, currentPage: 1 });
  }, [appliedFilters.sortField, appliedFilters.sortDirection]);

  const handleFilter = useCallback((updates: Partial<FilterState>) => {
    const params = new URLSearchParams(searchParams.toString());
    const isPaginationChange = 'currentPage' in updates || 'itemsPerPage' in updates;

    Object.entries(updates).forEach(([key, value]) => {
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

  const filteredEstoque = useMemo(() => estoque.filter(item => {
    const nome = item.produto?.nome || '';
    const matchesSearch = nome.toLowerCase().includes(appliedFilters.search.toLowerCase());
    const matchesQuantidadeMin = !appliedFilters.quantidadeMin || item.quantidade >= Number(appliedFilters.quantidadeMin);
    const matchesQuantidadeMax = !appliedFilters.quantidadeMax || item.quantidade <= Number(appliedFilters.quantidadeMax);
    const matchesPrecoMin = !appliedFilters.precoMin || item.preco >= Number(appliedFilters.precoMin);
    const matchesPrecoMax = !appliedFilters.precoMax || item.preco <= Number(appliedFilters.precoMax);

    return matchesSearch && matchesQuantidadeMin && matchesQuantidadeMax && matchesPrecoMin && matchesPrecoMax;
  }).sort((a, b) => {
    const direction = appliedFilters.sortDirection === 'asc' ? 1 : -1;
    if (appliedFilters.sortField === 'nome') {
      const nomeA = a.produto?.nome || '';
      const nomeB = b.produto?.nome || '';
      return nomeA.localeCompare(nomeB) * direction;
    }
    if (appliedFilters.sortField === 'preco') {
      return (a.preco - b.preco) * direction;
    }
    if (appliedFilters.sortField === 'quantidade') {
      return (a.quantidade - b.quantidade) * direction;
    }
    if (appliedFilters.sortField === 'produtoId') {
      return (a.produtoId - b.produtoId) * direction;
    }
    return 0;
  }), [estoque, appliedFilters]);

  const paginatedEstoque = useMemo(() => filteredEstoque.slice(
    (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage,
    appliedFilters.currentPage * appliedFilters.itemsPerPage
  ), [filteredEstoque, appliedFilters]);

  return {
    estoque,
    produtos,
    filteredEstoque,
    paginatedEstoque,
    filterValues: appliedFilters,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};