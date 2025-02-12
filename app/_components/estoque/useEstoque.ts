import { useState } from 'react';
import { EstoqueItem } from '@/app/interfaces';

const estoqueInicial: EstoqueItem[] = [
  { id: 1, nome: 'Item 1', quantidade: 10, preco: 100 },
  { id: 2, nome: 'Item 2', quantidade: 5, preco: 200 },
];

type FilterState = {
  search: string;
  quantidadeMin: string;
  quantidadeMax: string;
  precoMin: string;
  precoMax: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
};

interface UseEstoqueReturn {
  estoque: EstoqueItem[];
  filteredEstoque: EstoqueItem[];
  paginatedEstoque: EstoqueItem[];
  filterValues: FilterState;
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<FilterState>) => void;
  handleCreate: (item: Omit<EstoqueItem, 'id'>) => void;
  handleEdit: (id: number, updates: Partial<EstoqueItem>) => void;
  handleDelete: (id: number) => void;
  setAppliedFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
}

export const useEstoque = (): UseEstoqueReturn => {
  const [estoque, setEstoque] = useState<EstoqueItem[]>(estoqueInicial);
  const [filterValues, setFilterValues] = useState<FilterState>({
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

  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filterValues);

  const handleSort = (field: string) => {
    const newDirection = appliedFilters.sortField === field && appliedFilters.sortDirection === 'asc' ? 'desc' : 'asc';
    setAppliedFilters(prev => ({ ...prev, sortField: field, sortDirection: newDirection }));
  };

  const handleFilter = (updates: Partial<FilterState>) => {
    if ('currentPage' in updates) {
      setAppliedFilters(prev => ({ ...prev, ...updates }));
      setFilterValues(prev => ({ ...prev, ...updates }));
    } else {
      setFilterValues(prev => ({ ...prev, ...updates }));
    }
  };

  const handleCreate = (item: Omit<EstoqueItem, 'id'>) => {
    const newItem = {
      id: Math.max(...estoque.map(i => i.id)) + 1,
      ...item,
    };
    setEstoque(prev => [...prev, newItem]);
  };

  const handleEdit = (id: number, updates: Partial<EstoqueItem>) => {
    setEstoque(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleDelete = (id: number) => {
    setEstoque(prev => prev.filter(item => item.id !== id));
  };

  const filteredEstoque = estoque.filter(item => {
    return (
      item.nome.toLowerCase().includes(appliedFilters.search.toLowerCase()) &&
      (appliedFilters.quantidadeMin === '' || item.quantidade >= Number(appliedFilters.quantidadeMin)) &&
      (appliedFilters.quantidadeMax === '' || item.quantidade <= Number(appliedFilters.quantidadeMax)) &&
      (appliedFilters.precoMin === '' || item.preco >= Number(appliedFilters.precoMin)) &&
      (appliedFilters.precoMax === '' || item.preco <= Number(appliedFilters.precoMax))
    );
  });

  const paginatedEstoque = filteredEstoque.slice(
    (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage,
    appliedFilters.currentPage * appliedFilters.itemsPerPage
  );

  return {
    estoque,
    filteredEstoque,
    paginatedEstoque,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
    setAppliedFilters,
  };
};