import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Produto, FilterValues } from '@/types/interfaces/entities';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProdutoInsertData, ProdutoPatchData } from '@/types/types/types';

const defaultFilters: FilterValues & { categoryId?: number } = {
  currentPage: 1,
  itemsPerPage: 10,
  search: '',
  categoryId: undefined,
};

export const useProduto = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const getFiltersFromParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    const currentPage = Number(params.get('page')) || defaultFilters.currentPage;
    const itemsPerPage = Number(params.get('limit')) || defaultFilters.itemsPerPage;
    const search = params.get('search') || defaultFilters.search;
    const categoryId = Number(params.get('category')) || defaultFilters.categoryId;

    params.set('page', String(currentPage));
    params.set('limit', String(itemsPerPage));

    if (search) params.set('search', String(search));

    if (categoryId) params.set('category', String(categoryId));

    return {
      currentPage,
      itemsPerPage,
      search,
      categoryId: categoryId?.toString(),
      toString: params.toString(),
    };
  }, [searchParams]);

  const queryParams = getFiltersFromParams();
  const paramsToString = queryParams.toString;

  const getAllProdutos = () => {
    return useQuery<Produto[]>({
      queryKey: ['produtos-all'],
      queryFn: async () => {
        const response = await fetch(`/api/produto/findAll`);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const result = await response.json();

        return result;
      },
    });
  };

  const getProdutosByParams = () => {
    return useQuery<{ produtos: Produto[]; total: number }>({
      queryKey: ['produtos', paramsToString],
      queryFn: async () => {
        const response = await fetch(`/api/produto/findPerPage?${paramsToString}`);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const result = await response.json();

        return result;
      },
    });
  };

  const createMutation = useMutation({
    mutationFn: async (produto: ProdutoInsertData) => {
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
      queryClient.invalidateQueries({ queryKey: ['produtos-all'] });
    },
  });

  const handleCreate = (produto: ProdutoInsertData) => {
    createMutation.mutate(produto);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: ProdutoPatchData) => {
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
      queryClient.invalidateQueries({ queryKey: ['produtos-all'] });
    },
  });

  const handleEdit = (id: ProdutoPatchData['id'], updates: ProdutoPatchData['updates']) => {
    editMutation.mutate({ id, updates });
  };

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
      queryClient.invalidateQueries({ queryKey: ['produtos-all'] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const getActiveFilters = () => {
    const active = [];
    if (queryParams.search) {
      active.push({ label: 'Nome', value: queryParams.search });
    }
    if (queryParams.categoryId) {
      active.push({
        label: 'Categoria',
        value: queryParams.categoryId.toString(),
      });
    }
    return active;
  };

  const updateUrl = useCallback(
    (newFilters: FilterValues & { categoryId: string | null | undefined }) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set('page', String(newFilters.currentPage));
      params.set('limit', String(newFilters.itemsPerPage));

      if (newFilters.search) {
        params.set('search', newFilters.search);
      } else {
        params.delete('search');
      }

      if (newFilters.categoryId) {
        params.set('category', String(newFilters.categoryId));
      } else {
        params.delete('category');
      }

      router.replace(`?${params.toString()}`);
    },
    [router, searchParams],
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
      case 'Categoria':
        newFilters = { ...newFilters, categoryId: undefined };
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
    queryParams: queryParams as FilterValues,
    getAllProdutos,
    getProdutosByParams,
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
  };
};
