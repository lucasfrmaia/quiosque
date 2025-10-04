import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category, FilterValues } from '@/types/interfaces/entities';
import { useRouter, useSearchParams } from 'next/navigation';
import { CategoryNewData, CategoryUpdateData } from '@/types/types/types';

const defaultFilters: FilterValues = {
  currentPage: 1,
  itemsPerPage: 5,
  search: '',
};

export const useCategory = () => {
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

  const categoryParams = useQuery<{ categories: Category[]; total: number }>({
    queryKey: ['categories', paramsToString],
    queryFn: async () => {
      const response = await fetch(`/api/category/findPerPage?${paramsToString}`);

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const result = await response.json();

      return result;
    },
  });

  const getAllCategories = () => {
    return useQuery<Category[]>({
      queryKey: ['categories'],
      queryFn: async () => {
        const response = await fetch(`/api/category/findAll`);

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const result = await response.json();

        return result;
      },
    });
  };

  const createMutation = useMutation({
    mutationFn: async (category: CategoryNewData) => {
      const response = await fetch('/api/category/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create category');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['categories', paramsToString] });
    },
  });

  const handleCreate = (category: CategoryNewData) => {
    createMutation.mutate(category);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: CategoryUpdateData) => {
      const response = await fetch(`/api/category/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update category');
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['categories', paramsToString] });
    },
  });

  const handleEdit = (id: CategoryUpdateData['id'], updates: CategoryUpdateData['updates']) => {
    editMutation.mutate({ id, updates });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/category/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete category');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['categories', paramsToString] });
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
    return active;
  };

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
    }
    updateUrl(newFilters);
  };

  const resetFilters = () => {
    const params = new URLSearchParams();
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
    categoryParams,
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
    getAllCategories,
  };
};
