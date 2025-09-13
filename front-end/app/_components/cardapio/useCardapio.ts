import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Produto } from '@/types/interfaces/interfaces';

type FilterState = {
  search: string;
  precoMin: string;
  precoMax: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
};

interface UseCardapioReturn {
  produtos: Produto[];
  filteredProdutos: Produto[];
  paginatedProdutos: Produto[];
  filterValues: FilterState;
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<FilterState>) => void;
  handleCreate: (produto: Omit<Produto, 'id'>) => void;
  handleEdit: (id: number, updates: Partial<Produto>) => void;
  handleDelete: (id: number) => void;
  setAppliedFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
}

export const useCardapio = (): UseCardapioReturn => {
  const queryClient = useQueryClient();

  const { data: produtos = [], isLoading, error } = useQuery<Produto[]>({
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

  const [filterValues, setFilterValues] = useState<FilterState>({
    search: '',
    precoMin: '',
    precoMax: '',
    currentPage: 1,
    itemsPerPage: 10,
    sortField: 'nome',
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
    mutationFn: async (produto: Omit<Produto, 'id'>) => {
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

  const handleCreate = (produto: Omit<Produto, 'id'>) => {
    createMutation.mutate(produto);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Produto> }) => {
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

  const handleEdit = (id: number, updates: Partial<Produto>) => {
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

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
                         produto.descricao?.toLowerCase().includes(appliedFilters.search.toLowerCase());
    const matchesPrecoMin = !appliedFilters.precoMin || produto.preco >= Number(appliedFilters.precoMin);
    const matchesPrecoMax = !appliedFilters.precoMax || produto.preco <= Number(appliedFilters.precoMax);

    return matchesSearch && matchesPrecoMin && matchesPrecoMax;
  }).sort((a, b) => {
    const direction = appliedFilters.sortDirection === 'asc' ? 1 : -1;
    if (appliedFilters.sortField === 'preco') {
      return (a.preco - b.preco) * direction;
    }
    const aValue = a[appliedFilters.sortField as keyof Produto] || '';
    const bValue = b[appliedFilters.sortField as keyof Produto] || '';
    return (aValue < bValue ? -1 : 1) * direction;
  });

  const paginatedProdutos = filteredProdutos.slice(
    (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage,
    appliedFilters.currentPage * appliedFilters.itemsPerPage
  );

  return {
    produtos,
    filteredProdutos,
    paginatedProdutos,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
    setAppliedFilters,
  };
};