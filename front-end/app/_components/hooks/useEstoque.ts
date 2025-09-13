import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProdutoEstoque } from '@/types/interfaces/entities';

type FilterState = {
  search: string;
  quantidadeMin: string;
  quantidadeMax: string;
  precoMin: string;
  precoMax: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
};

interface UseEstoqueReturn {
  estoque: ProdutoEstoque[];
  filteredEstoque: ProdutoEstoque[];
  paginatedEstoque: ProdutoEstoque[];
  filterValues: FilterState;
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<FilterState>) => void;
  handleCreate: (estoque: Omit<ProdutoEstoque, 'id' | 'notaFiscals'>) => void;
  handleEdit: (id: number, updates: Partial<Omit<ProdutoEstoque, 'id' | 'notaFiscals'>>) => void;
  handleDelete: (id: number) => void;
  setAppliedFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
}

export const useEstoque = (): UseEstoqueReturn => {
  const queryClient = useQueryClient();

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

  const [filterValues, setFilterValues] = useState<FilterState>({
    search: '',
    quantidadeMin: '',
    quantidadeMax: '',
    precoMin: '',
    precoMax: '',
    currentPage: 1,
    itemsPerPage: 10,
    sortField: 'produtoId',
    sortDirection: 'asc',
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filterValues);

  const handleSort = (field: string) => {
    const newDirection = appliedFilters.sortField === field && appliedFilters.sortDirection === 'asc' ? 'desc' : 'asc';
    setAppliedFilters(prev => ({ ...prev, sortField: field, sortDirection: newDirection }));
  };

  const handleFilter = (updates: Partial<FilterState>) => {
    if ('currentPage' in updates) {
      setAppliedFilters(prev => ({ ...prev, ...updates }));
      setFilterValues(prev => ({ ...prev, ...updates }));
    } else {
      setFilterValues(prev => ({ ...prev, ...updates }));
    }
  };

  const createMutation = useMutation({
    mutationFn: async (estoque: Omit<ProdutoEstoque, 'id' | 'notaFiscals'>) => {
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

  const handleCreate = (estoque: Omit<ProdutoEstoque, 'id' | 'notaFiscals'>) => {
    createMutation.mutate(estoque);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Omit<ProdutoEstoque, 'id' | 'notaFiscals'>> }) => {
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

  const handleEdit = (id: number, updates: Partial<Omit<ProdutoEstoque, 'id' | 'notaFiscals'>>) => {
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

  const filteredEstoque = estoque.filter(item => {
    const matchesSearch = item.produtoId.toString().includes(appliedFilters.search);
    const matchesQuantidadeMin = !appliedFilters.quantidadeMin || item.quantidade >= Number(appliedFilters.quantidadeMin);
    const matchesQuantidadeMax = !appliedFilters.quantidadeMax || item.quantidade <= Number(appliedFilters.quantidadeMax);
    const matchesPrecoMin = !appliedFilters.precoMin || item.preco >= Number(appliedFilters.precoMin);
    const matchesPrecoMax = !appliedFilters.precoMax || item.preco <= Number(appliedFilters.precoMax);

    return matchesSearch && matchesQuantidadeMin && matchesQuantidadeMax && matchesPrecoMin && matchesPrecoMax;
  }).sort((a, b) => {
    const direction = appliedFilters.sortDirection === 'asc' ? 1 : -1;
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
  });

  const paginatedEstoque = filteredEstoque.slice(
    (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage,
    appliedFilters.currentPage * appliedFilters.itemsPerPage
  );

  return {
    estoque,
    filteredEstoque,
    paginatedEstoque,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
    setAppliedFilters,
  };
};