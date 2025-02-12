import { useState } from 'react';
import { GastoDiario } from '@/app/interfaces';

const gastosIniciais: GastoDiario[] = [
  { id: 1, descricao: 'Compra de materiais', valor: 100, data: '2023-10-01' },
  { id: 2, descricao: 'Pagamento de funcionários', valor: 200, data: '2023-10-02' },
];

type FilterState = {
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

interface UseGastosReturn {
  gastos: GastoDiario[];
  filteredGastos: GastoDiario[];
  paginatedGastos: GastoDiario[];
  filterValues: FilterState;
  handleSort: (field: string) => void;
  handleFilter: (updates: Partial<FilterState>) => void;
  handleCreate: (gasto: Omit<GastoDiario, 'id'>) => void;
  handleEdit: (id: number, updates: Partial<GastoDiario>) => void;
  handleDelete: (id: number) => void;
  setAppliedFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
}

export const useGastos = (): UseGastosReturn => {
  const [gastos, setGastos] = useState<GastoDiario[]>(gastosIniciais);
  const [filterValues, setFilterValues] = useState<FilterState>({
    search: '',
    valorMin: '',
    valorMax: '',
    dataInicio: '',
    dataFim: '',
    currentPage: 1,
    itemsPerPage: 10,
    sortField: 'data',
    sortDirection: 'desc',
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filterValues);

  const handleSort = (field: string) => {
    const newDirection = appliedFilters.sortField === field && appliedFilters.sortDirection === 'asc' ? 'desc' : 'asc';
    setAppliedFilters(prev => ({ ...prev, sortField: field, sortDirection: newDirection }));
  };

  const handleFilter = (updates: Partial<FilterState>) => {
    if ('currentPage' in updates) {
      // Atualizações de paginação são aplicadas imediatamente
      setAppliedFilters(prev => ({ ...prev, ...updates }));
      setFilterValues(prev => ({ ...prev, ...updates }));
    } else {
      // Outros filtros só são armazenados nos valores temporários
      setFilterValues(prev => ({ ...prev, ...updates }));
    }
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
    const matchesSearch = gasto.descricao.toLowerCase().includes(appliedFilters.search.toLowerCase());
    const matchesValorMin = !appliedFilters.valorMin || gasto.valor >= Number(appliedFilters.valorMin);
    const matchesValorMax = !appliedFilters.valorMax || gasto.valor <= Number(appliedFilters.valorMax);
    const matchesDataInicio = !appliedFilters.dataInicio || gasto.data >= appliedFilters.dataInicio;
    const matchesDataFim = !appliedFilters.dataFim || gasto.data <= appliedFilters.dataFim;

    return matchesSearch && matchesValorMin && matchesValorMax && matchesDataInicio && matchesDataFim;
  }).sort((a, b) => {
    const direction = appliedFilters.sortDirection === 'asc' ? 1 : -1;
    if (appliedFilters.sortField === 'valor') {
      return (a.valor - b.valor) * direction;
    }
    if (appliedFilters.sortField === 'data') {
      return (a.data < b.data ? -1 : 1) * direction;
    }
    return (a.descricao < b.descricao ? -1 : 1) * direction;
  });

  const paginatedGastos = filteredGastos.slice(
    (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage,
    appliedFilters.currentPage * appliedFilters.itemsPerPage
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
    setAppliedFilters,
  };
};