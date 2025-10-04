import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProdutoEstoque, Produto, FilterValues, SortDirection } from '@/types/interfaces/entities';
import { useRouter, useSearchParams } from 'next/navigation';
import { EstoqueNewData, EstoqueUpdatePayload } from '@/types/types/types';

const defaultFilters: FilterValues = {
  currentPage: 1,
  itemsPerPage: 10,
  search: '',
  categoryId: null,
};

export const useEstoque = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const getFiltersFromParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    const currentPage = Number(params.get('page')) || defaultFilters.currentPage;
    const itemsPerPage = Number(params.get('limit')) || defaultFilters.itemsPerPage;
    const search = params.get('search') || defaultFilters.search;
    const quantidadeMin = params.get('quantidadeMin') || '';
    const quantidadeMax = params.get('quantidadeMax') || '';
    const precoMin = params.get('precoMin') || '';
    const precoMax = params.get('precoMax') || '';
    const categoryId = params.get('categoryId') ? Number(params.get('categoryId')) : null;

    params.set('page', String(currentPage));
    params.set('limit', String(itemsPerPage));

    if (search) params.set('search', search);
    else params.delete('search');
    if (quantidadeMin) params.set('quantidadeMin', quantidadeMin);
    else params.delete('quantidadeMin');
    if (quantidadeMax) params.set('quantidadeMax', quantidadeMax);
    else params.delete('quantidadeMax');
    if (precoMin) params.set('precoMin', precoMin);
    else params.delete('precoMin');
    if (precoMax) params.set('precoMax', precoMax);
    else params.delete('precoMax');
    if (categoryId !== null) params.set('categoryId', String(categoryId));
    else params.delete('categoryId');

    return {
      currentPage,
      itemsPerPage,
      search,
      quantidadeMin,
      quantidadeMax,
      precoMin,
      precoMax,
      categoryId: categoryId?.toString(),
      toString: params.toString(),
    };
  }, [searchParams]);

  const queryParams = getFiltersFromParams();
  const paramsToString = queryParams.toString;

  const estoqueQuery = useQuery({
    queryKey: ['estoque', paramsToString],
    queryFn: async () => {
      const response = await fetch(`/api/estoque/findPerPage?${paramsToString}`);

      if (!response.ok) throw new Error('Failed to fetch estoque');

      const result = await response.json();

      return result;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (estoque: EstoqueNewData) => {
      const response = await fetch('/api/estoque/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estoque),
      });
      if (!response.ok) throw new Error('Failed to create estoque');
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to create estoque');
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estoque', paramsToString] });
    },
  });
  const handleCreate = (estoque: EstoqueNewData) => {
    createMutation.mutate(estoque);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: EstoqueUpdatePayload) => {
      const response = await fetch(`/api/estoque/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update estoque');
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to update estoque');
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estoque', paramsToString] });
    },
  });
  const handleEdit = (id: EstoqueUpdatePayload['id'], updates: EstoqueUpdatePayload['updates']) => {
    editMutation.mutate({ id, updates });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/estoque/delete/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete estoque');
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to delete estoque');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estoque', paramsToString] });
    },
  });
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const getActiveFilters = () => {
    const active = [];
    if (queryParams.search) active.push({ label: 'Nome', value: queryParams.search });
    if (queryParams.quantidadeMin)
      active.push({ label: 'Qtd Min', value: queryParams.quantidadeMin });
    if (queryParams.quantidadeMax)
      active.push({ label: 'Qtd Max', value: queryParams.quantidadeMax });
    if (queryParams.precoMin) active.push({ label: 'Preço Min', value: queryParams.precoMin });
    if (queryParams.precoMax) active.push({ label: 'Preço Max', value: queryParams.precoMax });
    if (queryParams.categoryId !== null)
      active.push({ label: 'Categoria', value: queryParams.categoryId?.toString() || '' });
    return active;
  };

  const updateUrl = useCallback(
    (newFilters: FilterValues) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set('page', String(newFilters.currentPage));
      params.set('limit', String(newFilters.itemsPerPage));

      if (newFilters.search) params.set('search', newFilters.search);
      else params.delete('search');

      if (newFilters.quantidadeMin) params.set('quantidadeMin', newFilters.quantidadeMin);
      else params.delete('quantidadeMin');

      if (newFilters.quantidadeMax) params.set('quantidadeMax', newFilters.quantidadeMax);
      else params.delete('quantidadeMax');

      if (newFilters.precoMin) params.set('precoMin', newFilters.precoMin);
      else params.delete('precoMin');

      if (newFilters.precoMax) params.set('precoMax', newFilters.precoMax);
      else params.delete('precoMax');

      if (newFilters.categoryId !== null) params.set('categoryId', String(newFilters.categoryId));
      else params.delete('categoryId');

      router.replace(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleApply = () => {
    const newFilters = { ...queryParams, currentPage: 1 };
    updateUrl(newFilters);
  };

  const handleSort = (field: string, direction: SortDirection) => {
    const newFilters = {
      ...queryParams,
      sortField: field,
      sortDirection: direction,
      currentPage: 1,
    };
    updateUrl(newFilters);
  };

  const handleRemoveFilter = (index: number) => {
    const activeFilters = getActiveFilters();
    const filterToRemove = activeFilters[index];
    let newFilters = { ...queryParams };

    switch (filterToRemove.label) {
      case 'Nome':
        newFilters.search = '';
        break;
      case 'Qtd Min':
        newFilters.quantidadeMin = '';
        break;
      case 'Qtd Max':
        newFilters.quantidadeMax = '';
        break;
      case 'Preço Min':
        newFilters.precoMin = '';
        break;
      case 'Preço Max':
        newFilters.precoMax = '';
        break;
      case 'Categoria':
        newFilters.categoryId = undefined;
        break;
    }
    updateUrl(newFilters);
  };

  const resetFilters = () => {
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('limit', '10');
    router.replace(`?${params.toString()}`);
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
    estoqueQuery,
    handleCreate,
    handleEdit,
    handleDelete,
    handleApply,
    resetFilters,
    handlePageChange,
    handleItemsPerPageChange,
    handleRemoveFilter,
    updateUrl,
    getActiveFilters,
    handleSort,
  };
};
