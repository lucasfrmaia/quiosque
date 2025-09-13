import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NotaFiscal } from '@/types/interfaces/entities';

type FilterState = {
  search: string;
  quantidadeMin: string;
  quantidadeMax: string;
  totalMin: string;
  totalMax: string;
  dataInicio: string;
  dataFim: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
};

interface UseNotasReturn {
  notas: NotaFiscal[];
  filteredNotas: NotaFiscal[];
  paginatedNotas: NotaFiscal[];
  filterValues: FilterState;
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<FilterState>) => void;
  setAppliedFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
}

export const useNotas = (): UseNotasReturn => {
  const { data: notas = [], isLoading, error } = useQuery<NotaFiscal[]>({
    queryKey: ['notas'],
    queryFn: async () => {
      const response = await fetch('/api/notas/findAll');
      if (!response.ok) {
        throw new Error('Failed to fetch notas');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch notas');
      }
      return result.data;
    },
  });

  const [filterValues, setFilterValues] = useState<FilterState>({
    search: '',
    quantidadeMin: '',
    quantidadeMax: '',
    totalMin: '',
    totalMax: '',
    dataInicio: '',
    dataFim: '',
    currentPage: 1,
    itemsPerPage: 5,
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
      setAppliedFilters(prev => ({ ...prev, ...updates }));
      setFilterValues(prev => ({ ...prev, ...updates }));
    } else {
      setFilterValues(prev => ({ ...prev, ...updates }));
    }
  };

  const filteredNotas = notas.filter(nota => {
    const matchesSearch = nota.produtoId.toString().includes(appliedFilters.search);
    const matchesQuantidadeMin = !appliedFilters.quantidadeMin || nota.quantidade >= Number(appliedFilters.quantidadeMin);
    const matchesQuantidadeMax = !appliedFilters.quantidadeMax || nota.quantidade <= Number(appliedFilters.quantidadeMax);
    const matchesTotalMin = !appliedFilters.totalMin || nota.total >= Number(appliedFilters.totalMin);
    const matchesTotalMax = !appliedFilters.totalMax || nota.total <= Number(appliedFilters.totalMax);
    const matchesDataInicio = !appliedFilters.dataInicio || nota.data >= appliedFilters.dataInicio;
    const matchesDataFim = !appliedFilters.dataFim || nota.data <= appliedFilters.dataFim;

    return matchesSearch && matchesQuantidadeMin && matchesQuantidadeMax && 
           matchesTotalMin && matchesTotalMax && matchesDataInicio && matchesDataFim;
  }).sort((a, b) => {
    const direction = appliedFilters.sortDirection === 'asc' ? 1 : -1;
    if (appliedFilters.sortField === 'quantidade') {
      return (a.quantidade - b.quantidade) * direction;
    }
    if (appliedFilters.sortField === 'total') {
      return (a.total - b.total) * direction;
    }
    if (appliedFilters.sortField === 'data') {
      return (a.data < b.data ? -1 : 1) * direction;
    }
    return (a.produtoId - b.produtoId) * direction;
  });

  const paginatedNotas = filteredNotas.slice(
    (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage,
    appliedFilters.currentPage * appliedFilters.itemsPerPage
  );

  return {
    notas,
    filteredNotas,
    paginatedNotas,
    filterValues,
    handleSort,
    handleFilter,
    setAppliedFilters,
  };
};