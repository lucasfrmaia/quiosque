import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GastoDiario } from '@/types/interfaces/entities';

type FilterState = {
  search: string;
  valorMin: string;
  valorMax: string;
  dataInicio: string;
  dataFim: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
};

interface UseGastosReturn {
  gastos: GastoDiario[];
  filteredGastos: GastoDiario[];
  paginatedGastos: GastoDiario[];
  filterValues: FilterState;
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<FilterState>) => void;
  handleCreate: (gasto: Omit<GastoDiario, 'id'>) => void;
  handleEdit: (id: number, updates: Partial<GastoDiario>) => void;
  handleDelete: (id: number) => void;
  setAppliedFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
}

export const useGastos = (): UseGastosReturn => {
  const queryClient = useQueryClient();

  const { data: gastos = [], isLoading, error } = useQuery<GastoDiario[]>({
    queryKey: ['gastos'],
    queryFn: async () => {
      const response = await fetch('/api/gastos/findAll');
      if (!response.ok) {
        throw new Error('Failed to fetch gastos');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch gastos');
      }
      return result.data;
    },
  });

  const [filterValues, setFilterValues] = useState<FilterState>({
    search: '',
    valorMin: '',
    valorMax: '',
    dataInicio: '',
    dataFim: '',
    currentPage: 1,
    itemsPerPage: 10,
    sortField: 'data',
    sortDirection: 'desc',
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filterValues);

  const handleSort = (field: string) => {
    const newDirection = appliedFilters.sortField === field && appliedFilters.sortDirection === 'asc' ? 'desc' : 'asc';
    setAppliedFilters(prev => ({ ...prev, sortField: field, sortDirection: newDirection }));
  };

  const handleFilter = (updates: Partial<FilterState>) => {
    if ('currentPage' in updates) {
      // Atualizações de paginação são aplicadas imediatamente
      setAppliedFilters(prev => ({ ...prev, ...updates }));
      setFilterValues(prev => ({ ...prev, ...updates }));
    } else {
      // Outros filtros só são armazenados nos valores temporários
      setFilterValues(prev => ({ ...prev, ...updates }));
    }
  };

  const createMutation = useMutation({
    mutationFn: async (gasto: Omit<GastoDiario, 'id'>) => {
      const response = await fetch('/api/gastos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gasto),
      });
      if (!response.ok) {
        throw new Error('Failed to create gasto');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create gasto');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
    },
  });

  const handleCreate = (gasto: Omit<GastoDiario, 'id'>) => {
    createMutation.mutate(gasto);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<GastoDiario> }) => {
      const response = await fetch(`/api/gastos/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update gasto');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update gasto');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
    },
  });

  const handleEdit = (id: number, updates: Partial<GastoDiario>) => {
    editMutation.mutate({ id, updates });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/gastos/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete gasto');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete gasto');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const filteredGastos = gastos.filter(gasto => {
    const matchesSearch = gasto.descricao.toLowerCase().includes(appliedFilters.search.toLowerCase());
    const matchesValorMin = !appliedFilters.valorMin || gasto.valor >= Number(appliedFilters.valorMin);
    const matchesValorMax = !appliedFilters.valorMax || gasto.valor <= Number(appliedFilters.valorMax);
    const matchesDataInicio = !appliedFilters.dataInicio || gasto.data >= appliedFilters.dataInicio;
    const matchesDataFim = !appliedFilters.dataFim || gasto.data <= appliedFilters.dataFim;

    return matchesSearch && matchesValorMin && matchesValorMax && matchesDataInicio && matchesDataFim;
  }).sort((a, b) => {
    const direction = appliedFilters.sortDirection === 'asc' ? 1 : -1;
    if (appliedFilters.sortField === 'valor') {
      return (a.valor - b.valor) * direction;
    }
    if (appliedFilters.sortField === 'data') {
      return (a.data < b.data ? -1 : 1) * direction;
    }
    return (a.descricao < b.descricao ? -1 : 1) * direction;
  });

  const paginatedGastos = filteredGastos.slice(
    (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage,
    appliedFilters.currentPage * appliedFilters.itemsPerPage
  );

  return {
    gastos,
    filteredGastos,
    paginatedGastos,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
    setAppliedFilters,
  };
};