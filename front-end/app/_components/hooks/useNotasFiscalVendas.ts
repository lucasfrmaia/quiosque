import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotaFiscalVenda, ProdutoVenda, FilterValues } from '@/types/interfaces/entities';
import { useRouter, useSearchParams } from 'next/navigation';

const defaultFilters: FilterValues = {
  currentPage: 1,
  itemsPerPage: 5,
  search: '',
};

export const useNotasFiscaisVendas = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const getFiltersFromParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    const currentPage = Number(params.get('page')) || defaultFilters.currentPage;
    const itemsPerPage = Number(params.get('limit')) || defaultFilters.itemsPerPage;
    const search = params.get('search') || defaultFilters.search;

    params.set('page', String(currentPage));
    params.set('limit', String(itemsPerPage));
    params.set('search', String(search));

    return {
      currentPage,
      itemsPerPage,
      search,
      toString: params.toString(),
    };
  }, [searchParams]);

  const queryParams = getFiltersFromParams();
  const paramsToString = queryParams.toString;

  // Buscar notas fiscais com paginação e filtros
  const getNotasByParams = () => {
    return useQuery<{ data: NotaFiscalVenda[]; total: number }>({
      queryKey: ['notas', paramsToString],
      queryFn: async () => {
        const response = await fetch(`/api/nota-fiscal-venda/findPerPage?${paramsToString}`);

        if (!response.ok) {
          throw new Error('Failed to fetch notas fiscais de venda');
        }

        const result = await response.json();
        return result;
      },
    });
  };

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
    mutationFn: async (
      nota: Omit<NotaFiscalVenda, 'id' | 'produtos'> & {
        produtos: Omit<ProdutoVenda, 'id' | 'produto' | 'notaFiscal'>[];
      }
    ) => {
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
      queryClient.invalidateQueries({ queryKey: ['notas', paramsToString] });
    },
  });

  const handleCreate = (
    nota: Omit<NotaFiscalVenda, 'id' | 'produtos'> & {
      produtos: Omit<ProdutoVenda, 'id' | 'produto' | 'notaFiscal'>[];
    }
  ) => {
    createMutation.mutate(nota);
  };

  const editMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Omit<NotaFiscalVenda, 'id' | 'produtos'>>;
    }) => {
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
      queryClient.invalidateQueries({ queryKey: ['notas', paramsToString] });
    },
  });

  const handleEdit = (
    id: number,
    updates: Partial<Omit<NotaFiscalVenda, 'id' | 'produtos'>>
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
      queryClient.invalidateQueries({ queryKey: ['notas', paramsToString] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Filtros ativos
  const getActiveFilters = () => {
    const active = [];
    if (queryParams.search) {
      active.push({ label: 'Pesquisa', value: queryParams.search });
    }
    return active;
  };

  // Atualizar URL
  const updateUrl = useCallback(
    (newFilters: FilterValues) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set('page', String(newFilters.currentPage));
      params.set('limit', String(newFilters.itemsPerPage));

      if (newFilters.search) {
        params.set('search', newFilters.search);
      } else {
        params.delete('search');
      }

      router.replace(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleApply = () => {
    const newFilters = { ...queryParams, currentPage: 1 };
    updateUrl(newFilters);
  };

  const handleRemoveFilter = (index: number) => {
    const activeFilters = getActiveFilters();
    const filterToRemove = activeFilters[index];

    let newFilters = { ...queryParams };
    switch (filterToRemove.label) {
      case 'Pesquisa':
        newFilters = { ...newFilters, search: '' };
        break;
    }
    updateUrl(newFilters);
  };

  const resetFilters = () => {
    const params = new URLSearchParams();
    router.replace(`?${params.toString()}`);
  };

  const handleSort = (field: string) => {
    // implementar se quiser ordenação por campo específico
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
    handleApply,
    resetFilters,
    handlePageChange,
    handleItemsPerPageChange,
    handleRemoveFilter,
    handleSort,
    updateUrl,
    getActiveFilters,
  };
};
