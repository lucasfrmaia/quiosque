import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { NotaFiscalVenda } from '@/types/interfaces/entities';

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
  notas: NotaFiscalVenda[];
  filteredNotas: NotaFiscalVenda[];
  paginatedNotas: NotaFiscalVenda[];
  filterValues: FilterState;
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<FilterState>) => void;
}

export const useNotas = (): UseNotasReturn => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const appliedFilters = useMemo<FilterState>(() => ({
    search: searchParams.get('search') || '',
    quantidadeMin: searchParams.get('quantidadeMin') || '',
    quantidadeMax: searchParams.get('quantidadeMax') || '',
    totalMin: searchParams.get('totalMin') || '',
    totalMax: searchParams.get('totalMax') || '',
    dataInicio: searchParams.get('dataInicio') || '',
    dataFim: searchParams.get('dataFim') || '',
    currentPage: parseInt(searchParams.get('currentPage') || '1', 10),
    itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '5', 10),
    sortField: searchParams.get('sortField') || 'data',
    sortDirection: (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc',
  }), [searchParams]);

  const { data: notas = [], isLoading, error } = useQuery<NotaFiscalVenda[]>({
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

  const handleSort = useCallback((field: string) => {
    const newDirection = appliedFilters.sortField === field && appliedFilters.sortDirection === 'asc' ? 'desc' : 'asc';
    handleFilter({ sortField: field, sortDirection: newDirection, currentPage: 1 });
  }, [appliedFilters.sortField, appliedFilters.sortDirection, handleFilter]);

  const filteredNotas = useMemo(() => notas.filter(nota => {
    const totalQuantidade = nota.produtos?.reduce((sum, p) => sum + p.quantidade, 0) || 0;
    const matchesSearch = nota.id.toString().includes(appliedFilters.search);
    const matchesQuantidadeMin = !appliedFilters.quantidadeMin || totalQuantidade >= Number(appliedFilters.quantidadeMin);
    const matchesQuantidadeMax = !appliedFilters.quantidadeMax || totalQuantidade <= Number(appliedFilters.quantidadeMax);
    const matchesTotalMin = !appliedFilters.totalMin || nota.total >= Number(appliedFilters.totalMin);
    const matchesTotalMax = !appliedFilters.totalMax || nota.total <= Number(appliedFilters.totalMax);
    const matchesDataInicio = !appliedFilters.dataInicio || nota.data >= appliedFilters.dataInicio;
    const matchesDataFim = !appliedFilters.dataFim || nota.data <= appliedFilters.dataFim;

    return matchesSearch && matchesQuantidadeMin && matchesQuantidadeMax && 
           matchesTotalMin && matchesTotalMax && matchesDataInicio && matchesDataFim;
  }).sort((a, b) => {
    const direction = appliedFilters.sortDirection === 'asc' ? 1 : -1;
    const aTotalQuantidade = a.produtos?.reduce((sum, p) => sum + p.quantidade, 0) || 0;
    const bTotalQuantidade = b.produtos?.reduce((sum, p) => sum + p.quantidade, 0) || 0;
    if (appliedFilters.sortField === 'quantidade') {
      return (aTotalQuantidade - bTotalQuantidade) * direction;
    }
    if (appliedFilters.sortField === 'total') {
      return (a.total - b.total) * direction;
    }
    if (appliedFilters.sortField === 'data') {
      return (a.data < b.data ? -1 : 1) * direction;
    }
    return (a.id - b.id) * direction;
  }), [notas, appliedFilters]);

  const paginatedNotas = useMemo(() => filteredNotas.slice(
    (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage,
    appliedFilters.currentPage * appliedFilters.itemsPerPage
  ), [filteredNotas, appliedFilters]);

  return {
    notas,
    filteredNotas,
    paginatedNotas,
    filterValues: appliedFilters,
    handleSort,
    handleFilter,
  };
};