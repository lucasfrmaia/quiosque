import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { NotaFiscalVenda, ProdutoVenda, FilterValues, SortDirection } from '@/types/interfaces/entities';

type FilterState = FilterValues;

interface UseNotasReturn {
  notas: NotaFiscalVenda[];
  filteredNotas: NotaFiscalVenda[];
  paginatedNotas: NotaFiscalVenda[];
  filterValues: FilterState;
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<FilterState>) => void;
  handleReset: () => void;
  handleCreate: (nota: Omit<NotaFiscalVenda, 'id' | 'produtos'> & { produtos: Omit<ProdutoVenda, 'id' | 'produto' | 'notaFiscal'>[] }) => void;
  handleEdit: (id: number, updates: Partial<Omit<NotaFiscalVenda, 'id' | 'produtos'>>) => void;
  handleDelete: (id: number) => void;
}

export const useNotas = (): UseNotasReturn => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filterValues = useMemo<FilterState>(() => ({
    search: searchParams.get('search') || '',
    quantidadeMin: searchParams.get('quantidadeMin') || '',
    quantidadeMax: searchParams.get('quantidadeMax') || '',
    precoMin: searchParams.get('precoMin') || '',
    precoMax: searchParams.get('precoMax') || '',
    currentPage: parseInt(searchParams.get('currentPage') || '1', 10),
    itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '5', 10),
    sortField: searchParams.get('sortField') || 'data',
    sortDirection: (searchParams.get('sortDirection') || 'desc') as SortDirection,
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

  const handleReset = useCallback(() => {
    const params = new URLSearchParams();
    params.set('currentPage', '1');
    params.set('itemsPerPage', '5');
    params.set('sortField', 'data');
    params.set('sortDirection', 'desc');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname]);

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

  const handleSort = useCallback((field: string) => {
    const newDirection = filterValues.sortField === field && filterValues.sortDirection === 'asc' ? 'desc' : 'asc';
    handleFilter({ sortField: field, sortDirection: newDirection, currentPage: 1 });
  }, [filterValues.sortField, filterValues.sortDirection, handleFilter]);

  const filteredNotas = useMemo(() => notas.filter(nota => {
    const totalQuantidade = nota.produtos?.reduce((sum, p) => sum + p.quantidade, 0) || 0;
    const matchesSearch = nota.id.toString().includes(filterValues.search);
    const matchesQuantidadeMin = !filterValues.quantidadeMin || totalQuantidade >= Number(filterValues.quantidadeMin);
    const matchesQuantidadeMax = !filterValues.quantidadeMax || totalQuantidade <= Number(filterValues.quantidadeMax);
    const matchesTotalMin = !filterValues.precoMin || nota.total >= Number(filterValues.precoMin);
    const matchesTotalMax = !filterValues.precoMax || nota.total <= Number(filterValues.precoMax);
    const matchesDataInicio = !filterValues.search || nota.data >= filterValues.search;
    const matchesDataFim = !filterValues.search || nota.data <= filterValues.search;

    return matchesSearch && matchesQuantidadeMin && matchesQuantidadeMax &&
           matchesTotalMin && matchesTotalMax && matchesDataInicio && matchesDataFim;
  }).sort((a, b) => {
    const direction = filterValues.sortDirection === 'asc' ? 1 : -1;
    const aTotalQuantidade = a.produtos?.reduce((sum, p) => sum + p.quantidade, 0) || 0;
    const bTotalQuantidade = b.produtos?.reduce((sum, p) => sum + p.quantidade, 0) || 0;
    if (filterValues.sortField === 'quantidade') {
      return (aTotalQuantidade - bTotalQuantidade) * direction;
    }
    if (filterValues.sortField === 'total') {
      return (a.total - b.total) * direction;
    }
    if (filterValues.sortField === 'data') {
      return (a.data < b.data ? -1 : 1) * direction;
    }
    return (a.id - b.id) * direction;
  }), [notas, filterValues]);

  const paginatedNotas = useMemo(() => filteredNotas.slice(
    (filterValues.currentPage - 1) * filterValues.itemsPerPage,
    filterValues.currentPage * filterValues.itemsPerPage
  ), [filteredNotas, filterValues]);

  return {
    notas,
    filteredNotas,
    paginatedNotas,
    filterValues,
    handleSort,
    handleFilter,
    handleReset,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};