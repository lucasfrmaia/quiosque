import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Cardapio } from '@/types/interfaces/interfaces';

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
  cardapios: Cardapio[];
  filteredCardapios: Cardapio[];
  paginatedCardapios: Cardapio[];
  filterValues: FilterState;
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<FilterState>) => void;
  handleCreate: (cardapio: Omit<Cardapio, 'id'>) => void;
  handleEdit: (id: number, updates: Partial<Cardapio>) => void;
  handleDelete: (id: number) => void;
  setAppliedFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
}

export const useCardapio = (): UseCardapioReturn => {
  const queryClient = useQueryClient();

  const { data: cardapios = [], isLoading, error } = useQuery<Cardapio[]>({
    queryKey: ['cardapios'],
    queryFn: async () => {
      const response = await fetch('/api/cardapio/findAll');
      if (!response.ok) {
        throw new Error('Failed to fetch cardapios');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch cardapios');
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
    sortField: 'produto.nome',
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
    mutationFn: async (cardapio: Omit<Cardapio, 'id'>) => {
      const response = await fetch('/api/cardapio/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardapio),
      });
      if (!response.ok) {
        throw new Error('Failed to create cardapio');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create cardapio');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cardapios'] });
    },
  });

  const handleCreate = (cardapio: Omit<Cardapio, 'id'>) => {
    createMutation.mutate(cardapio);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Cardapio> }) => {
      const response = await fetch(`/api/cardapio/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update cardapio');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update cardapio');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cardapios'] });
    },
  });

  const handleEdit = (id: number, updates: Partial<Cardapio>) => {
    editMutation.mutate({ id, updates });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/cardapio/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete cardapio');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete cardapio');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cardapios'] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const filteredCardapios = cardapios.filter(cardapio => {
    const produto = cardapio.produto;
    if (!produto) return false;
    const matchesSearch = produto.nome.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
                         produto.descricao?.toLowerCase().includes(appliedFilters.search.toLowerCase());
    const matchesPrecoMin = !appliedFilters.precoMin || produto.preco >= Number(appliedFilters.precoMin);
    const matchesPrecoMax = !appliedFilters.precoMax || produto.preco <= Number(appliedFilters.precoMax);

    return matchesSearch && matchesPrecoMin && matchesPrecoMax;
  }).sort((a, b) => {
    const direction = appliedFilters.sortDirection === 'asc' ? 1 : -1;
    const aProduto = a.produto;
    const bProduto = b.produto;
    if (!aProduto || !bProduto) return 0;
    if (appliedFilters.sortField === 'preco') {
      return (aProduto.preco - bProduto.preco) * direction;
    }
    const aValue = aProduto[appliedFilters.sortField.replace('produto.', '') as keyof typeof aProduto] || '';
    const bValue = bProduto[appliedFilters.sortField.replace('produto.', '') as keyof typeof bProduto] || '';
    return (aValue < bValue ? -1 : 1) * direction;
  });

  const paginatedCardapios = filteredCardapios.slice(
    (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage,
    appliedFilters.currentPage * appliedFilters.itemsPerPage
  );

  return {
    cardapios,
    filteredCardapios,
    paginatedCardapios,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
    setAppliedFilters,
  };
};