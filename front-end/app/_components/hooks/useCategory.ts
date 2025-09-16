import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Category, FilterValues, SortDirection } from '@/types/interfaces/entities';

export const useCategory = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filterValues = useMemo<FilterValues>(() => ({
    search: searchParams.get('search') || '',
    quantidadeMin: searchParams.get('quantidadeMin') || '',
    quantidadeMax: searchParams.get('quantidadeMax') || '',
    precoMin: searchParams.get('precoMin') || '',
    precoMax: searchParams.get('precoMax') || '',
    currentPage: parseInt(searchParams.get('currentPage') || '1', 10),
    itemsPerPage: parseInt(searchParams.get('itemsPerPage') || '10', 10),
    sortField: searchParams.get('sortField') || 'name',
    sortDirection: (searchParams.get('sortDirection') || 'asc') as SortDirection,
  }), [searchParams]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/category/findAll');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch categories');
      }
      return result.data;
    },
  });


  const filteredCategories = useMemo(() => {
    let filtered = [...(Array.isArray(categories) ? categories : [])];

    if (filterValues.search) {
      filtered = filtered.filter(c => c.name.toLowerCase().includes(filterValues.search.toLowerCase()));
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = (a as any)[filterValues.sortField];
      const bValue = (b as any)[filterValues.sortField];
      if (aValue < bValue) return filterValues.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return filterValues.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [categories, filterValues]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (filterValues.currentPage - 1) * filterValues.itemsPerPage;
    const endIndex = startIndex + filterValues.itemsPerPage;
    return filteredCategories.slice(startIndex, endIndex);
  }, [filteredCategories, filterValues]);

  const handleFilter = useCallback((newFilters: Partial<FilterValues>) => {
    const params = new URLSearchParams(searchParams.toString());
    const isPaginationChange = 'currentPage' in newFilters || 'itemsPerPage' in newFilters;

    Object.entries(newFilters).forEach(([key, value]) => {
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
    const direction = filterValues.sortField === field && filterValues.sortDirection === 'asc' ? 'desc' : 'asc';
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortField', field);
    params.set('sortDirection', direction);
    params.set('currentPage', '1');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [filterValues.sortField, filterValues.sortDirection, searchParams, router, pathname]);


  const handleReset = useCallback(() => {
    const params = new URLSearchParams();
    params.set('currentPage', '1');
    params.set('itemsPerPage', '10');
    params.set('sortField', 'name');
    params.set('sortDirection', 'asc');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname]);

  const createMutation = useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'produtos'>) => {
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
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleCreate = (category: Omit<Category, 'id' | 'produtos'>) => {
    createMutation.mutate(category);
  };

  const editMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Omit<Category, 'id' | 'produtos'>> }) => {
      const response = await fetch(`/api/category/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update category');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleEdit = (id: number, updates: Partial<Omit<Category, 'id' | 'produtos'>>) => {
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
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return {
    categories,
    paginatedCategories,
    filteredCategories,
    filterValues,
    handleSort,
    handleFilter,
    handleReset,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};