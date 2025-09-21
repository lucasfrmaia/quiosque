import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Produto, FilterValues } from '@/types/interfaces/entities';
import { useRouter, useSearchParams } from 'next/navigation';

const defaultFilters: FilterValues = {
  currentPage: 1,
  itemsPerPage: 10,
  search: '',
};

export const useProduto = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔹 Extrai os filtros da URL
  const getFiltersFromParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    const currentPage = Number(params.get('page')) || defaultFilters.currentPage;
    const itemsPerPage = Number(params.get('limit')) || defaultFilters.itemsPerPage;
    const search = params.get('search') || defaultFilters.search;

    params.set('page', String(currentPage));
    params.set('limit', String(itemsPerPage));
    
    if (search)
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

  // 🔹 Buscar produtos paginados
  const getProdutosByParams = () => {
    return useQuery<{ produtos: Produto[]; total: number }>({
      queryKey: ['produtos', paramsToString],
      queryFn: async () => {
        const response = await fetch(`/api/produto/findPerPage?${paramsToString}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products', await response.json());
        }
        
        const result = await response.json();

        return result;
      },
    });
  };

  // 🔹 Criar produto
  const createMutation = useMutation({
    mutationFn: async (
      produto: Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>
    ) => {
      const response = await fetch('/api/produto/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });
      if (!response.ok) {
        throw new Error('Failed to create produto');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create produto');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos', paramsToString] });
    },
  });

  const handleCreate = (
    produto: Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>
  ) => {
    createMutation.mutate(produto);
  };

  // 🔹 Editar produto
  const editMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<
        Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>
      >;
    }) => {
      const response = await fetch(`/api/produto/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update produto');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update produto');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos', paramsToString] });
    },
  });

  const handleEdit = (
    id: number,
    updates: Partial<Omit<Produto, 'id' | 'categoria' | 'estoques' | 'compras' | 'vendas'>>
  ) => {
    editMutation.mutate({ id, updates });
  };

  // 🔹 Deletar produto
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/produto/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete produto');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete produto');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos', paramsToString] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // 🔹 Filtros ativos
  const getActiveFilters = () => {
    const active = [];
    if (queryParams.search) {
      active.push({ label: 'Nome', value: queryParams.search });
    }
    return active;
  };

  // 🔹 Atualizar URL
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
      case 'Nome':
        newFilters = { ...newFilters, search: '' };
        break;
    }
    updateUrl(newFilters);
  };

  const resetFilters = () => {
    const params = new URLSearchParams();
    router.replace(`?${params.toString()}`);
  };

  const handleSort = (field: string) => {};

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
    getProdutosByParams,
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
