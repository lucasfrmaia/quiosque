import { useState } from 'react';
import { Produto } from '@/app/interfaces';

const produtosIniciais: Produto[] = [
  { id: 1, nome: 'Produto 1', preco: 10, descricao: 'Descrição do Produto 1' },
  { id: 2, nome: 'Produto 2', preco: 20, descricao: 'Descrição do Produto 2' },
  { id: 3, nome: 'Café', preco: 5, descricao: 'Café quente' },
];

type FilterState = {
  search: string;
  precoMin: string;
  precoMax: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
};

interface UseCardapioReturn {
  produtos: Produto[];
  filteredProdutos: Produto[];
  paginatedProdutos: Produto[];
  filterValues: FilterState;
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<FilterState>) => void;
  handleCreate: (produto: Omit<Produto, 'id'>) => void;
  handleEdit: (id: number, updates: Partial<Produto>) => void;
  handleDelete: (id: number) => void;
  setAppliedFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
}

export const useCardapio = (): UseCardapioReturn => {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [filterValues, setFilterValues] = useState<FilterState>({
    search: '',
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

  const handleCreate = (produto: Omit<Produto, 'id'>) => {
    const newProduto = {
      id: Math.max(...produtos.map(p => p.id)) + 1,
      ...produto,
    };
    setProdutos(prev => [...prev, newProduto]);
  };

  const handleEdit = (id: number, updates: Partial<Produto>) => {
    setProdutos(prev => prev.map(produto => 
      produto.id === id ? { ...produto, ...updates } : produto
    ));
  };

  const handleDelete = (id: number) => {
    setProdutos(prev => prev.filter(produto => produto.id !== id));
  };

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
                         produto.descricao.toLowerCase().includes(appliedFilters.search.toLowerCase());
    const matchesPrecoMin = !appliedFilters.precoMin || produto.preco >= Number(appliedFilters.precoMin);
    const matchesPrecoMax = !appliedFilters.precoMax || produto.preco <= Number(appliedFilters.precoMax);

    return matchesSearch && matchesPrecoMin && matchesPrecoMax;
  }).sort((a, b) => {
    const direction = appliedFilters.sortDirection === 'asc' ? 1 : -1;
    if (appliedFilters.sortField === 'preco') {
      return (a.preco - b.preco) * direction;
    }
    return (a[appliedFilters.sortField as keyof Produto] < b[appliedFilters.sortField as keyof Produto] ? -1 : 1) * direction;
  });

  const paginatedProdutos = filteredProdutos.slice(
    (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage,
    appliedFilters.currentPage * appliedFilters.itemsPerPage
  );

  return {
    produtos,
    filteredProdutos,
    paginatedProdutos,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
    setAppliedFilters,
  };
};