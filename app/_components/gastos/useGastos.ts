import { useState } from 'react';
import { GastoDiario } from '@/app/interfaces';

const gastosIniciais: GastoDiario[] = [
  { id: 1, descricao: 'Compra de materiais', valor: 100, data: '2023-10-01' },
  { id: 2, descricao: 'Pagamento de funcionários', valor: 200, data: '2023-10-02' },
];

interface UseGastosReturn {
  gastos: GastoDiario[];
  filteredGastos: GastoDiario[];
  paginatedGastos: GastoDiario[];
  filterValues: {
    search: string;
    valorMin: string;
    valorMax: string;
    dataInicio: string;
    dataFim: string;
    currentPage: number;
    itemsPerPage: number;
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<typeof filterValues>) => void;
  handleCreate: (gasto: Omit<GastoDiario, 'id'>) => void;
  handleEdit: (id: number, updates: Partial<GastoDiario>) => void;
  handleDelete: (id: number) => void;
}

export const useGastos = (): UseGastosReturn => {
  const [gastos, setGastos] = useState<GastoDiario[]>(gastosIniciais);
  const [filterValues, setFilterValues] = useState({
    search: '',
    valorMin: '',
    valorMax: '',
    dataInicio: '',
    dataFim: '',
    currentPage: 1,
    itemsPerPage: 10,
    sortField: 'data',
    sortDirection: 'desc' as const,
  });

  const handleSort = (field: string) => {
    const direction = filterValues.sortField === field && filterValues.sortDirection === 'asc' ? 'desc' : 'asc';
    setFilterValues(prev => ({ ...prev, sortField: field, sortDirection: direction }));
  };

  const handleFilter = (updates: Partial<typeof filterValues>) => {
    setFilterValues(prev => ({ ...prev, ...updates, currentPage: 1 }));
  };

  const handleCreate = (gasto: Omit<GastoDiario, 'id'>) => {
    const newGasto = {
      id: Math.max(...gastos.map(g => g.id)) + 1,
      ...gasto,
    };
    setGastos(prev => [...prev, newGasto]);
  };

  const handleEdit = (id: number, updates: Partial<GastoDiario>) => {
    setGastos(prev => prev.map(gasto => 
      gasto.id === id ? { ...gasto, ...updates } : gasto
    ));
  };

  const handleDelete = (id: number) => {
    setGastos(prev => prev.filter(gasto => gasto.id !== id));
  };

  const filteredGastos = gastos.filter(gasto => {
    const matchesSearch = gasto.descricao.toLowerCase().includes(filterValues.search.toLowerCase());
    const matchesValorMin = !filterValues.valorMin || gasto.valor >= Number(filterValues.valorMin);
    const matchesValorMax = !filterValues.valorMax || gasto.valor <= Number(filterValues.valorMax);
    const matchesDataInicio = !filterValues.dataInicio || gasto.data >= filterValues.dataInicio;
    const matchesDataFim = !filterValues.dataFim || gasto.data <= filterValues.dataFim;

    return matchesSearch && matchesValorMin && matchesValorMax && matchesDataInicio && matchesDataFim;
  }).sort((a, b) => {
    const direction = filterValues.sortDirection === 'asc' ? 1 : -1;
    if (filterValues.sortField === 'valor') {
      return (a.valor - b.valor) * direction;
    }
    if (filterValues.sortField === 'data') {
      return (a.data < b.data ? -1 : 1) * direction;
    }
    return (a.descricao < b.descricao ? -1 : 1) * direction;
  });

  const paginatedGastos = filteredGastos.slice(
    (filterValues.currentPage - 1) * filterValues.itemsPerPage,
    filterValues.currentPage * filterValues.itemsPerPage
  );

  return {
    gastos,
    filteredGastos,
    paginatedGastos,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
  };
};