import { useState } from 'react';
import { EstoqueItem, FilterValues } from '@/app/interfaces';

const estoqueInicial: EstoqueItem[] = [
  { id: 1, nome: 'Item 1', quantidade: 10, preco: 100 },
  { id: 2, nome: 'Item 2', quantidade: 5, preco: 200 },
];

interface UseEstoqueReturn {
  estoque: EstoqueItem[];
  filteredEstoque: EstoqueItem[];
  paginatedEstoque: EstoqueItem[];
  filterValues: FilterValues;
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<FilterValues>) => void;
  handleCreate: (item: Omit<EstoqueItem, 'id'>) => void;
  handleEdit: (id: number, updates: Partial<EstoqueItem>) => void;
  handleDelete: (id: number) => void;
}

export const useEstoque = (): UseEstoqueReturn => {
  const [estoque, setEstoque] = useState<EstoqueItem[]>(estoqueInicial);
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

  const handleSort = (field: string) => {
    const direction = filterValues.sortField === field && filterValues.sortDirection === 'asc' ? 'desc' : 'asc';
    setFilterValues(prev => ({ ...prev, sortField: field, sortDirection: direction }));
  };

  const handleFilter = (updates: Partial<FilterValues>) => {
    setFilterValues(prev => ({ ...prev, ...updates, currentPage: 1 }));
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
      item.nome.toLowerCase().includes(filterValues.search.toLowerCase()) &&
      (filterValues.quantidadeMin === '' || item.quantidade >= Number(filterValues.quantidadeMin)) &&
      (filterValues.quantidadeMax === '' || item.quantidade <= Number(filterValues.quantidadeMax)) &&
      (filterValues.precoMin === '' || item.preco >= Number(filterValues.precoMin)) &&
      (filterValues.precoMax === '' || item.preco <= Number(filterValues.precoMax))
    );
  });

  const paginatedEstoque = filteredEstoque.slice(
    (filterValues.currentPage - 1) * filterValues.itemsPerPage,
    filterValues.currentPage * filterValues.itemsPerPage
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
  };
};