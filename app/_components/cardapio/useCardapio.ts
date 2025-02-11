import { useState } from 'react';
import { Produto } from '@/app/interfaces';

const produtosIniciais: Produto[] = [
  { id: 1, nome: 'Produto 1', preco: 10, descricao: 'Descrição do Produto 1' },
  { id: 2, nome: 'Produto 2', preco: 20, descricao: 'Descrição do Produto 2' },
  { id: 3, nome: 'Café', preco: 5, descricao: 'Café quente' },
];

interface UseCardapioReturn {
  produtos: Produto[];
  filteredProdutos: Produto[];
  paginatedProdutos: Produto[];
  filterValues: {
    search: string;
    precoMin: string;
    precoMax: string;
    currentPage: number;
    itemsPerPage: number;
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<typeof filterValues>) => void;
  handleCreate: (produto: Omit<Produto, 'id'>) => void;
  handleEdit: (id: number, updates: Partial<Produto>) => void;
  handleDelete: (id: number) => void;
}

export const useCardapio = (): UseCardapioReturn => {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [filterValues, setFilterValues] = useState({
    search: '',
    precoMin: '',
    precoMax: '',
    currentPage: 1,
    itemsPerPage: 10,
    sortField: 'nome',
    sortDirection: 'asc' as const,
  });

  const handleSort = (field: string) => {
    const direction = filterValues.sortField === field && filterValues.sortDirection === 'asc' ? 'desc' : 'asc';
    setFilterValues(prev => ({ ...prev, sortField: field, sortDirection: direction }));
  };

  const handleFilter = (updates: Partial<typeof filterValues>) => {
    setFilterValues(prev => ({ ...prev, ...updates, currentPage: 1 }));
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
    const matchesSearch = produto.nome.toLowerCase().includes(filterValues.search.toLowerCase()) ||
                         produto.descricao.toLowerCase().includes(filterValues.search.toLowerCase());
    const matchesPrecoMin = !filterValues.precoMin || produto.preco >= Number(filterValues.precoMin);
    const matchesPrecoMax = !filterValues.precoMax || produto.preco <= Number(filterValues.precoMax);

    return matchesSearch && matchesPrecoMin && matchesPrecoMax;
  }).sort((a, b) => {
    const direction = filterValues.sortDirection === 'asc' ? 1 : -1;
    if (filterValues.sortField === 'preco') {
      return (a.preco - b.preco) * direction;
    }
    return (a[filterValues.sortField as keyof Produto] < b[filterValues.sortField as keyof Produto] ? -1 : 1) * direction;
  });

  const paginatedProdutos = filteredProdutos.slice(
    (filterValues.currentPage - 1) * filterValues.itemsPerPage,
    filterValues.currentPage * filterValues.itemsPerPage
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
  };
};