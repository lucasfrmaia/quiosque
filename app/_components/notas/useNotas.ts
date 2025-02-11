import { useState } from 'react';
import { NotaFiscal } from '@/app/interfaces';

const notasIniciais: NotaFiscal[] = [
  { id: 1, produtoId: 1, quantidade: 10, data: '2023-10-01', total: 100 },
  { id: 2, produtoId: 2, quantidade: 5, data: '2023-10-02', total: 100 },
  { id: 3, produtoId: 3, quantidade: 8, data: '2023-10-03', total: 40 },
  { id: 4, produtoId: 4, quantidade: 3, data: '2023-10-04', total: 24 },
  { id: 5, produtoId: 5, quantidade: 2, data: '2023-10-05', total: 30 },
];

interface UseNotasReturn {
  notas: NotaFiscal[];
  filteredNotas: NotaFiscal[];
  paginatedNotas: NotaFiscal[];
  filterValues: {
    search: string;
    quantidadeMin: string;
    quantidadeMax: string;
    totalMin: string;
    totalMax: string;
    dataInicio: string;
    dataFim: string;
    currentPage: number;
    itemsPerPage: number;
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<typeof filterValues>) => void;
}

export const useNotas = (): UseNotasReturn => {
  const [notas] = useState<NotaFiscal[]>(notasIniciais);
  const [filterValues, setFilterValues] = useState({
    search: '',
    quantidadeMin: '',
    quantidadeMax: '',
    totalMin: '',
    totalMax: '',
    dataInicio: '',
    dataFim: '',
    currentPage: 1,
    itemsPerPage: 5,
    sortField: 'data',
    sortDirection: 'desc' as const,
  });

  const handleSort = (field: string) => {
    setFilterValues(prev => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilter = (updates: Partial<typeof filterValues>) => {
    setFilterValues(prev => ({ ...prev, ...updates, currentPage: 1 }));
  };

  const filteredNotas = notas.filter(nota => {
    const matchesSearch = nota.produtoId.toString().includes(filterValues.search);
    const matchesQuantidadeMin = !filterValues.quantidadeMin || nota.quantidade >= Number(filterValues.quantidadeMin);
    const matchesQuantidadeMax = !filterValues.quantidadeMax || nota.quantidade <= Number(filterValues.quantidadeMax);
    const matchesTotalMin = !filterValues.totalMin || nota.total >= Number(filterValues.totalMin);
    const matchesTotalMax = !filterValues.totalMax || nota.total <= Number(filterValues.totalMax);
    const matchesDataInicio = !filterValues.dataInicio || nota.data >= filterValues.dataInicio;
    const matchesDataFim = !filterValues.dataFim || nota.data <= filterValues.dataFim;

    return matchesSearch && matchesQuantidadeMin && matchesQuantidadeMax && 
           matchesTotalMin && matchesTotalMax && matchesDataInicio && matchesDataFim;
  }).sort((a, b) => {
    const direction = filterValues.sortDirection === 'asc' ? 1 : -1;
    if (filterValues.sortField === 'quantidade') {
      return (a.quantidade - b.quantidade) * direction;
    }
    if (filterValues.sortField === 'total') {
      return (a.total - b.total) * direction;
    }
    if (filterValues.sortField === 'data') {
      return a.data.localeCompare(b.data) * direction;
    }
    return (a[filterValues.sortField as keyof NotaFiscal] - b[filterValues.sortField as keyof NotaFiscal]) * direction;
  });

  const paginatedNotas = filteredNotas.slice(
    (filterValues.currentPage - 1) * filterValues.itemsPerPage,
    filterValues.currentPage * filterValues.itemsPerPage
  );

  return {
    notas,
    filteredNotas,
    paginatedNotas,
    filterValues,
    handleSort,
    handleFilter,
  };
};