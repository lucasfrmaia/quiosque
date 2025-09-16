import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Produto, FilterValues, SortDirection } from '@/types/interfaces/entities';

export const useProduto = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);

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
    sortField: searchParams.get('sortField') || 'nome',
    sortDirection: (searchParams.get('sortDirection') || 'asc') as SortDirection,
  }), [searchParams]);

  useEffect(() => {
    fetchAllProdutos();
  }, []);

  const fetchAllProdutos = async () => {
    try {
      const response = await fetch('/api/produto/findAll');
      if (response.ok) {
        const data = await response.json();
        setProdutos(Array.isArray(data) ? data : []);
      } else {
        setProdutos([]);
      }
    } catch (error) {
      console.error('Error fetching produtos:', error);
      setProdutos([]);
    }
  };

  const filteredProdutos = useMemo(() => {
    let filtered = [...(Array.isArray(produtos) ? produtos : [])];

    if (appliedFilters.search) {
      filtered = filtered.filter(p => p.nome.toLowerCase().includes(appliedFilters.search.toLowerCase()));
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
  }, [produtos, appliedFilters]);

  const paginatedProdutos = useMemo(() => {
    const startIndex = (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage;
    const endIndex = startIndex + appliedFilters.itemsPerPage;
    return filteredProdutos.slice(startIndex, endIndex);
  }, [filteredProdutos, appliedFilters]);

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

  const handleCreate = async (produto: Omit<Produto, 'id' | 'categoria'>) => {
    try {
      const response = await fetch('/api/produto/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });
      if (response.ok) {
        fetchAllProdutos();
      }
    } catch (error) {
      console.error('Error creating produto:', error);
    }
  };

  const handleEdit = async (id: number, produto: Partial<Produto>) => {
    try {
      const response = await fetch(`/api/produto/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });
      if (response.ok) {
        fetchAllProdutos();
      }
    } catch (error) {
      console.error('Error updating produto:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/produto/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchAllProdutos();
      }
    } catch (error) {
      console.error('Error deleting produto:', error);
    }
  };

  return {
    produtos,
    paginatedProdutos,
    filteredProdutos,
    filterValues: appliedFilters,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};