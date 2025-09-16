import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Category, FilterValues, SortDirection } from '@/types/interfaces/entities';

export const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const appliedFilters = useMemo<FilterValues>(() => ({
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

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const response = await fetch('/api/category/findAll');
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const filteredCategories = useMemo(() => {
    let filtered = [...(Array.isArray(categories) ? categories : [])];

    if (appliedFilters.search) {
      filtered = filtered.filter(c => c.name.toLowerCase().includes(appliedFilters.search.toLowerCase()));
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = (a as any)[appliedFilters.sortField];
      const bValue = (b as any)[appliedFilters.sortField];
      if (aValue < bValue) return appliedFilters.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return appliedFilters.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [categories, appliedFilters]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage;
    const endIndex = startIndex + appliedFilters.itemsPerPage;
    return filteredCategories.slice(startIndex, endIndex);
  }, [filteredCategories, appliedFilters]);

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
    const direction = appliedFilters.sortField === field && appliedFilters.sortDirection === 'asc' ? 'desc' : 'asc';
    handleFilter({ sortField: field, sortDirection: direction, currentPage: 1 });
  }, [appliedFilters.sortField, appliedFilters.sortDirection, handleFilter]);

  const handleCreate = async (category: Omit<Category, 'id' | 'produtos'>) => {
    try {
      const response = await fetch('/api/category/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (response.ok) {
        fetchAllCategories();
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleEdit = async (id: number, category: Partial<Omit<Category, 'id' | 'produtos'>>) => {
    try {
      const response = await fetch(`/api/category/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (response.ok) {
        fetchAllCategories();
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/category/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchAllCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return {
    categories,
    paginatedCategories,
    filteredCategories,
    filterValues: appliedFilters,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};