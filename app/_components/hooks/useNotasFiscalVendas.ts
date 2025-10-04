import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Assumindo que você definirá os novos tipos neste arquivo ou similar
import { NotaFiscalVenda, FilterValues } from '@/types/interfaces/entities';
import { useRouter, useSearchParams } from 'next/navigation';
import { NotaFiscalCreatePayload, NotaFiscalEditPayload } from '@/types/types/types';

const defaultFilters: FilterValues = {
  currentPage: 1,
  itemsPerPage: 10,
  search: '',
  dateStart: '',
  dateEnd: '',
  totalMin: '',
  totalMax: '',
};

export const useNotasFiscaisVendas = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extrair filtros da URL
  const queryParams = useMemo((): FilterValues => {
    const params = new URLSearchParams(searchParams.toString());
    return {
      ...defaultFilters,
      currentPage: parseInt(params.get('page') || defaultFilters.currentPage.toString(), 10),
      itemsPerPage: parseInt(params.get('limit') || defaultFilters.itemsPerPage.toString(), 10),
      search: params.get('search') || defaultFilters.search,
      dateStart: params.get('dateStart') || defaultFilters.dateStart,
      dateEnd: params.get('dateEnd') || defaultFilters.dateEnd,
      totalMin: params.get('totalMin') || defaultFilters.totalMin,
      totalMax: params.get('totalMax') || defaultFilters.totalMax,
    };
  }, [searchParams]);

  // Montar query string
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', queryParams.currentPage.toString());
    params.set('limit', queryParams.itemsPerPage.toString());

    if (queryParams.search) params.set('search', queryParams.search);
    if (queryParams.dateStart) params.set('dateStart', queryParams.dateStart);
    if (queryParams.dateEnd) params.set('dateEnd', queryParams.dateEnd);
    if (queryParams.totalMin) params.set('totalMin', queryParams.totalMin);
    if (queryParams.totalMax) params.set('totalMax', queryParams.totalMax);

    return params.toString();
  }, [queryParams]);

  // Buscar notas fiscais com paginação e filtros
  const getNotasByParams = () =>
    useQuery<{ notas: NotaFiscalVenda[]; total: number }>({
      queryKey: ['notas', queryString],
      queryFn: async () => {
        const response = await fetch(`/api/nota-fiscal-venda/findPerPage?${queryString}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notas fiscais de venda');
        }
        const result = await response.json();
        return result;
      },
    });

  // Buscar todas sem paginação
  const getAllNotas = () => {
    return useQuery<NotaFiscalVenda[]>({
      queryKey: ['notas'],
      queryFn: async () => {
        const response = await fetch(`/api/nota-fiscal-venda/findAll`);
        if (!response.ok) {
          throw new Error('Failed to fetch all notas fiscais de venda');
        }
        const result = await response.json();
        return result;
      },
    });
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (nota: NotaFiscalCreatePayload) => {
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
      queryClient.refetchQueries({ queryKey: ['notas'] });
      queryClient.refetchQueries({ queryKey: ['notas', queryParams] });
    },
  });

  const handleCreate = (nota: NotaFiscalCreatePayload) => {
    createMutation.mutate(nota);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: NotaFiscalEditPayload) => {
      const response = await fetch(`/api/nota-fiscal-venda/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update nota fiscal de venda');
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['notas'] });
      queryClient.refetchQueries({ queryKey: ['notas', queryParams] });
    },
  });

  const handleEdit = (
    id: NotaFiscalEditPayload['id'],
    updates: NotaFiscalEditPayload['updates'],
  ) => {
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
      queryClient.refetchQueries({ queryKey: ['notas'] });
      queryClient.refetchQueries({ queryKey: ['notas', queryParams] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Filtros ativos
  const getActiveFilters = useCallback(() => {
    const active = [];
    if (queryParams.search) active.push({ label: 'Pesquisa', value: queryParams.search });
    if (queryParams.dateStart)
      active.push({
        label: 'Data Início',
        value: new Date(queryParams.dateStart).toLocaleDateString('pt-BR'),
      });
    if (queryParams.dateEnd)
      active.push({
        label: 'Data Fim',
        value: new Date(queryParams.dateEnd).toLocaleDateString('pt-BR'),
      });
    if (queryParams.totalMin)
      active.push({ label: 'Total Mín', value: `R$ ${queryParams.totalMin}` });
    if (queryParams.totalMax)
      active.push({ label: 'Total Máx', value: `R$ ${queryParams.totalMax}` });
    return active;
  }, [queryParams]);

  // Atualizar URL
  const updateUrl = useCallback(
    (newFilters: FilterValues) => {
      const params = new URLSearchParams();
      params.set('page', newFilters.currentPage.toString());
      params.set('limit', newFilters.itemsPerPage.toString());

      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.dateStart) params.set('dateStart', newFilters.dateStart);
      if (newFilters.dateEnd) params.set('dateEnd', newFilters.dateEnd);
      if (newFilters.totalMin) params.set('totalMin', newFilters.totalMin);
      if (newFilters.totalMax) params.set('totalMax', newFilters.totalMax);

      router.replace(`?${params.toString()}`);
    },
    [router],
  );

  const resetFilters = useCallback(() => {
    updateUrl(defaultFilters);
  }, [updateUrl]);

  const handleRemoveFilter = (index: number) => {
    const activeFilters = getActiveFilters();
    const filterToRemove = activeFilters[index];

    let newFilters = { ...queryParams };
    switch (filterToRemove.label) {
      case 'Pesquisa':
        newFilters.search = '';
        break;
      case 'Data Início':
        newFilters.dateStart = '';
        break;
      case 'Data Fim':
        newFilters.dateEnd = '';
        break;
      case 'Total Mín':
        newFilters.totalMin = '';
        break;
      case 'Total Máx':
        newFilters.totalMax = '';
        break;
    }
    updateUrl(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...queryParams, currentPage: page };
    updateUrl(newFilters);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    const newFilters = { ...queryParams, itemsPerPage, currentPage: 1 };
    updateUrl(newFilters);
  };

  return {
    queryParams,
    getNotasByParams,
    getAllNotas,
    handleCreate,
    handleEdit,
    handleDelete,
    resetFilters,
    handlePageChange,
    handleItemsPerPageChange,
    handleRemoveFilter,
    updateUrl,
    getActiveFilters,
  };
};
