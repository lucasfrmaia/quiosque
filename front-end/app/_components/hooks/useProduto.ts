import { useState, useEffect } from 'react';
import { Produto } from '@/types/interfaces/entities';
import { FilterValues } from '@/types/interfaces/entities';

export const useProduto = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);
  const [paginatedProdutos, setPaginatedProdutos] = useState<Produto[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: '',
    quantidadeMin: '',
    quantidadeMax: '',
    precoMin: '',
    precoMax: '',
    currentPage: 1,
    itemsPerPage: 10,
    sortField: 'nome',
    sortDirection: 'asc',
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(filterValues);

  useEffect(() => {
    fetchAllProdutos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [produtos, appliedFilters]);

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

  const applyFilters = () => {
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

    // Pagination
    const startIndex = (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage;
    const endIndex = startIndex + appliedFilters.itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    setFilteredProdutos(filtered);
    setPaginatedProdutos(paginated);
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
    produtos: produtos,
    filteredProdutos,
    filterValues: appliedFilters,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
    setAppliedFilters,
  };
};