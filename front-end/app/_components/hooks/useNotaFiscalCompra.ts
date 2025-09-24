'use client';

import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { NotaFiscalCompra, ProdutoCompra, FilterValues } from '@/types/interfaces/entities';

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
  };

  // Extrair filtros da URL
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
    };
  }, [searchParams]);

  // Montar query string
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', queryParams.currentPage.toString());
    params.set('limit', queryParams.itemsPerPage.toString());

    if (queryParams.search) params.set('search', queryParams.search);
    if (queryParams.quantidadeMin) params.set('quantidadeMin', queryParams.quantidadeMin);
    if (queryParams.quantidadeMax) params.set('quantidadeMax', queryParams.quantidadeMax);
    if (queryParams.precoMin) params.set('precoMin', queryParams.precoMin);
    if (queryParams.precoMax) params.set('precoMax', queryParams.precoMax);
    
    return params.toString();
  }, [queryParams]);

  // Query principal
  const getNotasFiscaisCompras = () =>
    useQuery<{ notas: NotaFiscalCompra[]; total: number }>({
      queryKey: ['notaFiscalCompra', queryString],
      queryFn: async () => {
        const response = await fetch(`/api/nota-fiscal-compra/findPerPage?${queryString}`);
        const result = await response.json();

        if (!result.ok)
           throw new Error(result.error || 'Erro ao buscar notas fiscais de compra');
          
        return result;
      },
    });

  // Helpers para manipular URL
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
      router.replace(`?${params.toString()}`);
    },
    [router]
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
    if (queryParams.quantidadeMin) active.push({ label: 'Qtd Mín', value: queryParams.quantidadeMin });
    if (queryParams.quantidadeMax) active.push({ label: 'Qtd Máx', value: queryParams.quantidadeMax });
    if (queryParams.precoMin) active.push({ label: 'Preço Mín', value: queryParams.precoMin });
    if (queryParams.precoMax) active.push({ label: 'Preço Máx', value: queryParams.precoMax });
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
    }
    updateUrl(newFilters);
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (
      nota: Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'> & {
        produtos: Omit<ProdutoCompra, 'id' | 'produto' | 'notaFiscal'>[];
      }
    ) => {
      const response = await fetch('/api/nota-fiscal-compra/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nota),
      });
      if (!response.ok) throw new Error('Erro ao criar nota fiscal de compra');
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Erro ao criar nota fiscal de compra');
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notaFiscalCompra'] }),
  });

  const handleCreate = (nota: Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'> & { produtos: Omit<ProdutoCompra, 'id' | 'produto' | 'notaFiscal'>[] }) => {
    createMutation.mutate(nota);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'>> }) => {
      const response = await fetch(`/api/nota-fiscal-compra/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Erro ao atualizar nota fiscal de compra');
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Erro ao atualizar nota fiscal de compra');
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notaFiscalCompra'] }),
  });

  const handleEdit = (id: number, updates: Partial<Omit<NotaFiscalCompra, 'id' | 'fornecedor' | 'produtos'>>) => {
    editMutation.mutate({ id, updates });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/nota-fiscal-compra/delete/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao excluir nota fiscal de compra');
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Erro ao excluir nota fiscal de compra');
      return result;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notaFiscalCompra'] }),
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
