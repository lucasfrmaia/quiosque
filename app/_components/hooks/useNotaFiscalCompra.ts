'use client';

import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { NotaFiscalCompra, ProdutoCompra, FilterValues } from '@/types/interfaces/entities';
import { NotaFiscalCompraCreationData, NotaFiscalCompraUpdateData } from '@/types/types/types';

const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useNotaFiscalCompra = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultFilters: FilterValues = {
    currentPage: 1,
    itemsPerPage: 10,
    search: '',
    quantidadeMin: '',
    quantidadeMax: '',
    precoMin: '',
    precoMax: '',
    dateStart: '',
    dateEnd: '',
    totalMin: '',
    totalMax: '',
    fornecedorId: '',
  };

  const queryParams = useMemo((): FilterValues => {
    const params = new URLSearchParams(searchParams.toString());
    return {
      ...defaultFilters,
      currentPage: parseInt(params.get('page') || defaultFilters.currentPage.toString(), 10),
      itemsPerPage: parseInt(params.get('limit') || defaultFilters.itemsPerPage.toString(), 10),
      search: params.get('search') || defaultFilters.search,
      quantidadeMin: params.get('quantidadeMin') || defaultFilters.quantidadeMin,
      quantidadeMax: params.get('quantidadeMax') || defaultFilters.quantidadeMax,
      precoMin: params.get('precoMin') || defaultFilters.precoMin,
      precoMax: params.get('precoMax') || defaultFilters.precoMax,
      dateStart: params.get('dateStart') || defaultFilters.dateStart,
      dateEnd: params.get('dateEnd') || defaultFilters.dateEnd,
      totalMin: params.get('totalMin') || defaultFilters.totalMin,
      totalMax: params.get('totalMax') || defaultFilters.totalMax,
      fornecedorId: params.get('fornecedorId') || defaultFilters.fornecedorId,
    };
  }, [searchParams]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', queryParams.currentPage.toString());
    params.set('limit', queryParams.itemsPerPage.toString());

    if (queryParams.search) params.set('search', queryParams.search);
    if (queryParams.quantidadeMin) params.set('quantidadeMin', queryParams.quantidadeMin);
    if (queryParams.quantidadeMax) params.set('quantidadeMax', queryParams.quantidadeMax);
    if (queryParams.precoMin) params.set('precoMin', queryParams.precoMin);
    if (queryParams.precoMax) params.set('precoMax', queryParams.precoMax);
    if (queryParams.dateStart) params.set('dateStart', queryParams.dateStart);
    if (queryParams.dateEnd) params.set('dateEnd', queryParams.dateEnd);
    if (queryParams.totalMin) params.set('totalMin', queryParams.totalMin);
    if (queryParams.totalMax) params.set('totalMax', queryParams.totalMax);
    if (queryParams.fornecedorId) params.set('fornecedorId', queryParams.fornecedorId);
    return params.toString();
  }, [queryParams]);

  const getNotasFiscaisCompras = () =>
    useQuery<{ notas: NotaFiscalCompra[]; total: number }>({
      queryKey: ['notaFiscalCompra', queryString],
      queryFn: async () => {
        const response = await fetch(`${api_url}/api/nota-fiscal-compra/findPerPage?${queryString}`);
        const result = await response.json();

        if (!response.ok) throw new Error('Erro ao buscar notas fiscais de compra');
        return result;
      },
    });

  const updateUrl = useCallback(
    (newFilters: FilterValues) => {
      const params = new URLSearchParams();
      params.set('page', newFilters.currentPage.toString());
      params.set('limit', newFilters.itemsPerPage.toString());

      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.quantidadeMin) params.set('quantidadeMin', newFilters.quantidadeMin);
      if (newFilters.quantidadeMax) params.set('quantidadeMax', newFilters.quantidadeMax);
      if (newFilters.precoMin) params.set('precoMin', newFilters.precoMin);
      if (newFilters.precoMax) params.set('precoMax', newFilters.precoMax);
      if (newFilters.dateStart) params.set('dateStart', newFilters.dateStart);
      if (newFilters.dateEnd) params.set('dateEnd', newFilters.dateEnd);
      if (newFilters.totalMin) params.set('totalMin', newFilters.totalMin);
      if (newFilters.totalMax) params.set('totalMax', newFilters.totalMax);
      if (newFilters.fornecedorId) params.set('fornecedorId', newFilters.fornecedorId);
      router.replace(`?${params.toString()}`);
    },
    [router],
  );

  const resetFilters = useCallback(() => {
    updateUrl(defaultFilters);
  }, [updateUrl]);

  const handlePageChange = (page: number) => {
    updateUrl({ ...queryParams, currentPage: page });
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    updateUrl({ ...queryParams, itemsPerPage, currentPage: 1 });
  };

  const getActiveFilters = useCallback(() => {
    const active = [];
    if (queryParams.search) active.push({ label: 'Pesquisa', value: queryParams.search });
    if (queryParams.quantidadeMin)
      active.push({ label: 'Qtd Mín', value: queryParams.quantidadeMin });
    if (queryParams.quantidadeMax)
      active.push({ label: 'Qtd Máx', value: queryParams.quantidadeMax });
    if (queryParams.precoMin) active.push({ label: 'Preço Mín', value: queryParams.precoMin });
    if (queryParams.precoMax) active.push({ label: 'Preço Máx', value: queryParams.precoMax });
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
    if (queryParams.fornecedorId)
      active.push({ label: 'Fornecedor', value: queryParams.fornecedorId });
    return active;
  }, [queryParams]);

  const handleRemoveFilter = (index: number) => {
    const activeFilters = getActiveFilters();
    const filterToRemove = activeFilters[index];
    let newFilters = { ...queryParams };
    switch (filterToRemove.label) {
      case 'Pesquisa':
        newFilters.search = '';
        break;
      case 'Qtd Mín':
        newFilters.quantidadeMin = '';
        break;
      case 'Qtd Máx':
        newFilters.quantidadeMax = '';
        break;
      case 'Preço Mín':
        newFilters.precoMin = '';
        break;
      case 'Preço Máx':
        newFilters.precoMax = '';
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
      case 'Fornecedor':
        newFilters.fornecedorId = '';
        break;
    }
    updateUrl(newFilters);
  };

  const createMutation = useMutation({
    mutationFn: async (nota: NotaFiscalCompraCreationData) => {
      const response = await fetch(`${api_url}/api/nota-fiscal-compra/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nota),
      });
      if (!response.ok) throw new Error('Erro ao criar nota fiscal de compra');
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Erro ao criar nota fiscal de compra');
      return result.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['notaFiscalCompra'] });
      queryClient.refetchQueries({ queryKey: ['notaFiscalCompra', queryParams] });
    },
  });

  const handleCreate = (nota: NotaFiscalCompraCreationData) => {
    createMutation.mutate(nota);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: NotaFiscalCompraUpdateData) => {
      const response = await fetch(`${api_url}/api/nota-fiscal-compra/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Erro ao atualizar nota fiscal de compra');
      const result = await response.json();
      if (!result.success)
        throw new Error(result.error || 'Erro ao atualizar nota fiscal de compra');
      return result.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['notaFiscalCompra'] });
      queryClient.refetchQueries({ queryKey: ['notaFiscalCompra', queryParams] });
    },
  });

  const handleEdit = (
    id: number,
    updates: Partial<Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'>>,
  ) => {
    editMutation.mutate({ id, updates });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${api_url}/api/nota-fiscal-compra/delete/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao excluir nota fiscal de compra');
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Erro ao excluir nota fiscal de compra');
      return result;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['notaFiscalCompra'] });
      queryClient.refetchQueries({ queryKey: ['notaFiscalCompra', queryParams] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return {
    queryParams,
    updateUrl,
    resetFilters,
    handlePageChange,
    handleItemsPerPageChange,
    getActiveFilters,
    handleRemoveFilter,
    getNotasFiscaisCompras,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};
