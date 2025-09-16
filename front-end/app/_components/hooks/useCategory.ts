import { useState, useEffect } from 'react';
import { Category } from '@/types/interfaces/entities';
import { FilterValues } from '@/types/interfaces/entities';

export const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [paginatedCategories, setPaginatedCategories] = useState<Category[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: '',
    quantidadeMin: '',
    quantidadeMax: '',
    precoMin: '',
    precoMax: '',
    currentPage: 1,
    itemsPerPage: 10,
    sortField: 'name',
    sortDirection: 'asc',
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(filterValues);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [categories, appliedFilters]);

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

  const applyFilters = () => {
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

    // Pagination
    const startIndex = (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage;
    const endIndex = startIndex + appliedFilters.itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    setFilteredCategories(filtered);
    setPaginatedCategories(paginated);
  };

  const handleFilter = (newFilters: Partial<FilterValues>) => {
    setFilterValues(prev => ({ ...prev, ...newFilters, currentPage: 1 }));
  };

  const handleSort = (field: string) => {
    const direction = appliedFilters.sortField === field && appliedFilters.sortDirection === 'asc' ? 'desc' : 'asc';
    handleFilter({ sortField: field, sortDirection: direction });
  };

  useEffect(() => {
    setAppliedFilters(filterValues);
  }, [filterValues]);

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
    categories: categories,
    paginatedCategories,
    filteredCategories,
    filterValues: appliedFilters,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
    setAppliedFilters,
  };
};