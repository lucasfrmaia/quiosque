import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ProdutoCompra, SortDirection } from '@/types/interfaces/entities';

type FilterState = {
  search: string;
  precoMin: string;
  precoMax: string;
  quantidadeMin: string;
  quantidadeMax: string;
  dataInicio: string;
  dataFim: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
};

interface UseGastosReturn {
  gastos: ProdutoCompra[];
  filteredGastos: ProdutoCompra[];
  paginatedGastos: ProdutoCompra[];
  filterValues: FilterState;
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<FilterState>) => void;
  handleCreate: (gasto: Omit<ProdutoCompra, 'id' | 'produto'>) => void;
  handleEdit: (id: number, updates: Partial<Omit<ProdutoCompra, 'id' | 'produto'>>) => void;
  handleDelete: (id: number) => void;
}

export const useGastos = (): UseGastosReturn => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filterValues = useMemo<FilterState>(() => ({
    search: searchParams.get('search') || '',
    precoMin: searchParams.get('precoMin') || '',
    precoMax: searchParams.get('precoMax') || '',
    quantidadeMin: searchParams.get('quantidadeMin') || '',
    quantidadeMax: searchParams.get('quantidadeMax') || '',
    dataInicio: searchParams.get('dataInicio') || '',
    dataFim: searchParams.get('dataFim') || '',
    currentPage: parseInt(searchParams.get('currentPage') || '1', 10),
    itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '10', 10),
    sortField: searchParams.get('sortField') || 'data',
    sortDirection: (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc',
  }), [searchParams]);

  const { data: gastos = [], isLoading, error } = useQuery<ProdutoCompra[]>({
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
    const newDirection = filterValues.sortField === field && filterValues.sortDirection === 'asc' ? 'desc' : 'asc';
    handleFilter({ sortField: field, sortDirection: newDirection, currentPage: 1 });
  }, [filterValues.sortField, filterValues.sortDirection, handleFilter]);

  const createMutation = useMutation({
    mutationFn: async (gasto: Omit<ProdutoCompra, 'id' | 'produto'>) => {
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

  const handleCreate = (gasto: Omit<ProdutoCompra, 'id' | 'produto'>) => {
    createMutation.mutate(gasto);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Omit<ProdutoCompra, 'id' | 'produto'>> }) => {
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

  const handleEdit = (id: number, updates: Partial<Omit<ProdutoCompra, 'id' | 'produto'>>) => {
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

  const filteredGastos = useMemo(() => gastos.filter(gasto => {
    const matchesSearch = gasto.produto?.nome?.toLowerCase().includes(filterValues.search.toLowerCase()) || false;
    const matchesPrecoMin = !filterValues.precoMin || gasto.precoUnitario >= Number(filterValues.precoMin);
    const matchesPrecoMax = !filterValues.precoMax || gasto.precoUnitario <= Number(filterValues.precoMax);
    const matchesQuantidadeMin = !filterValues.quantidadeMin || gasto.quantidade >= Number(filterValues.quantidadeMin);
    const matchesQuantidadeMax = !filterValues.quantidadeMax || gasto.quantidade <= Number(filterValues.quantidadeMax);
    const matchesDataInicio = !filterValues.dataInicio || (gasto.notaFiscal && gasto.notaFiscal.data >= filterValues.dataInicio);
    const matchesDataFim = !filterValues.dataFim || (gasto.notaFiscal && gasto.notaFiscal.data <= filterValues.dataFim);

    return matchesSearch && matchesPrecoMin && matchesPrecoMax && matchesQuantidadeMin && matchesQuantidadeMax && matchesDataInicio && matchesDataFim;
  }).sort((a, b) => {
    const direction = filterValues.sortDirection === 'asc' ? 1 : -1;
    if (filterValues.sortField === 'preco') {
      return (a.precoUnitario - b.precoUnitario) * direction;
    }
    if (filterValues.sortField === 'quantidade') {
      return (a.quantidade - b.quantidade) * direction;
    }
    if (filterValues.sortField === 'produto.nome') {
      const aName = a.produto?.nome || '';
      const bName = b.produto?.nome || '';
      return (aName < bName ? -1 : 1) * direction;
    }
    if (filterValues.sortField === 'data') {
      const aData = a.notaFiscal?.data || '';
      const bData = b.notaFiscal?.data || '';
      return (aData < bData ? -1 : 1) * direction;
    }
    return (a.produtoId - b.produtoId) * direction;
  }), [gastos, filterValues]);

  const paginatedGastos = useMemo(() => filteredGastos.slice(
    (filterValues.currentPage - 1) * filterValues.itemsPerPage,
    filterValues.currentPage * filterValues.itemsPerPage
  ), [filteredGastos, filterValues]);

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
  };
};