'use client';

import { FC, useEffect, useState, useCallback } from 'react';
import { NotaFiscal } from '../interfaces';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '@/app/_components/Pagination';
import { SortIcon } from '../_components/SortIcon';
import { TextFilter } from '../_components/filtros/TextFilter';
import { NumberRangeFilter } from '../_components/filtros/NumberRangeFilter';
import { DateRangeFilter } from '..//_components/filtros/DateRangeFilter';

const notas: NotaFiscal[] = [
  { id: 1, produtoId: 1, quantidade: 10, data: '2023-10-01', total: 100 },
  { id: 2, produtoId: 2, quantidade: 5, data: '2023-10-02', total: 100 },
  { id: 3, produtoId: 3, quantidade: 8, data: '2023-10-03', total: 40 },
  { id: 4, produtoId: 4, quantidade: 3, data: '2023-10-04', total: 24 },
  { id: 5, produtoId: 5, quantidade: 2, data: '2023-10-05', total: 30 },
];

type SortableFields = 'produtoId' | 'quantidade' | 'total' | 'data';
type SortDirection = 'asc' | 'desc';

interface FilterValues {
  search: string;
  quantidadeMin: string;
  quantidadeMax: string;
  totalMin: string;
  totalMax: string;
  dataInicio: string;
  dataFim: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: SortableFields;
  sortDirection: SortDirection;
}

const NotasPage: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: searchParams.get('search') || '',
    quantidadeMin: searchParams.get('quantidadeMin') || '',
    quantidadeMax: searchParams.get('quantidadeMax') || '',
    totalMin: searchParams.get('totalMin') || '',
    totalMax: searchParams.get('totalMax') || '',
    dataInicio: searchParams.get('dataInicio') || '',
    dataFim: searchParams.get('dataFim') || '',
    currentPage: Number(searchParams.get('page')) || 1,
    itemsPerPage: Number(searchParams.get('limit')) || 5,
    sortField: (searchParams.get('sort') as SortableFields) || 'data',
    sortDirection: searchParams.get('order') === 'desc' ? 'desc' : 'asc'
  });

  const [filteredNotas, setFilteredNotas] = useState(notas);

  const applyFilters = useCallback(() => {
    let filtered = [...notas];

    if (filterValues.search) {
      filtered = filtered.filter(nota =>
        nota.produtoId.toString().includes(filterValues.search)
      );
    }

    if (filterValues.quantidadeMin) {
      filtered = filtered.filter(nota => nota.quantidade >= Number(filterValues.quantidadeMin));
    }

    if (filterValues.quantidadeMax) {
      filtered = filtered.filter(nota => nota.quantidade <= Number(filterValues.quantidadeMax));
    }

    if (filterValues.totalMin) {
      filtered = filtered.filter(nota => nota.total >= Number(filterValues.totalMin));
    }

    if (filterValues.totalMax) {
      filtered = filtered.filter(nota => nota.total <= Number(filterValues.totalMax));
    }

    if (filterValues.dataInicio) {
      filtered = filtered.filter(nota => nota.data >= filterValues.dataInicio);
    }

    if (filterValues.dataFim) {
      filtered = filtered.filter(nota => nota.data <= filterValues.dataFim);
    }

    filtered.sort((a, b) => {
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
      return (a[filterValues.sortField] - b[filterValues.sortField]) * direction;
    });

    setFilteredNotas(filtered);

    const params = new URLSearchParams();
    if (filterValues.search) params.set('search', filterValues.search);
    if (filterValues.quantidadeMin) params.set('quantidadeMin', filterValues.quantidadeMin);
    if (filterValues.quantidadeMax) params.set('quantidadeMax', filterValues.quantidadeMax);
    if (filterValues.totalMin) params.set('totalMin', filterValues.totalMin);
    if (filterValues.totalMax) params.set('totalMax', filterValues.totalMax);
    if (filterValues.dataInicio) params.set('dataInicio', filterValues.dataInicio);
    if (filterValues.dataFim) params.set('dataFim', filterValues.dataFim);
    if (filterValues.currentPage > 1) params.set('page', filterValues.currentPage.toString());
    if (filterValues.itemsPerPage !== 5) params.set('limit', filterValues.itemsPerPage.toString());
    if (filterValues.sortField !== 'data') params.set('sort', filterValues.sortField);
    if (filterValues.sortDirection !== 'desc') params.set('order', filterValues.sortDirection);
    router.push(`?${params.toString()}`);
  }, [filterValues, router]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    const defaultValues: FilterValues = {
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
      sortDirection: 'desc'
    };
    setFilterValues(defaultValues);
    router.push('');
    setFilteredNotas(notas);
  };

  const handleSort = (field: SortableFields) => {
    setFilterValues(prev => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  const totalPages = Math.ceil(filteredNotas.length / filterValues.itemsPerPage);
  const startIndex = (filterValues.currentPage - 1) * filterValues.itemsPerPage;
  const paginatedNotas = filteredNotas.slice(startIndex, startIndex + filterValues.itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Notas Fiscais</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextFilter
            value={filterValues.search}
            onChange={(value) => setFilterValues(prev => ({
              ...prev,
              search: value,
              currentPage: 1
            }))}
            placeholder="Pesquisar por ID do produto..."
          />
          
          <NumberRangeFilter
            minValue={filterValues.quantidadeMin}
            maxValue={filterValues.quantidadeMax}
            onMinChange={(value) => setFilterValues(prev => ({
              ...prev,
              quantidadeMin: value,
              currentPage: 1
            }))}
            onMaxChange={(value) => setFilterValues(prev => ({
              ...prev,
              quantidadeMax: value,
              currentPage: 1
            }))}
            minPlaceholder="Quantidade mín"
            maxPlaceholder="Quantidade máx"
          />
          
          <NumberRangeFilter
            minValue={filterValues.totalMin}
            maxValue={filterValues.totalMax}
            onMinChange={(value) => setFilterValues(prev => ({
              ...prev,
              totalMin: value,
              currentPage: 1
            }))}
            onMaxChange={(value) => setFilterValues(prev => ({
              ...prev,
              totalMax: value,
              currentPage: 1
            }))}
            minPlaceholder="Total mínimo"
            maxPlaceholder="Total máximo"
          />
          
          <div className="md:col-span-2 lg:col-span-3">
            <DateRangeFilter
              startDate={filterValues.dataInicio}
              endDate={filterValues.dataFim}
              onStartDateChange={(value) => setFilterValues(prev => ({
                ...prev,
                dataInicio: value,
                currentPage: 1
              }))}
              onEndDateChange={(value) => setFilterValues(prev => ({
                ...prev,
                dataFim: value,
                currentPage: 1
              }))}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Resetar Filtros
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>
        </div>

        <div className="table-modern">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th onClick={() => handleSort('produtoId')}>
                  <div className="flex items-center space-x-1">
                    <span>Produto ID</span>
                    <SortIcon 
                      field="produtoId"
                      currentSortField={filterValues.sortField}
                      currentSortDirection={filterValues.sortDirection}
                    />
                  </div>
                </th>
                <th onClick={() => handleSort('quantidade')}>
                  <div className="flex items-center space-x-1">
                    <span>Quantidade</span>
                    <SortIcon 
                      field="quantidade"
                      currentSortField={filterValues.sortField}
                      currentSortDirection={filterValues.sortDirection}
                    />
                  </div>
                </th>
                <th onClick={() => handleSort('total')}>
                  <div className="flex items-center space-x-1">
                    <span>Total</span>
                    <SortIcon 
                      field="total"
                      currentSortField={filterValues.sortField}
                      currentSortDirection={filterValues.sortDirection}
                    />
                  </div>
                </th>
                <th onClick={() => handleSort('data')}>
                  <div className="flex items-center space-x-1">
                    <span>Data</span>
                    <SortIcon 
                      field="data"
                      currentSortField={filterValues.sortField}
                      currentSortDirection={filterValues.sortDirection}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedNotas.map((nota) => (
                <tr key={nota.id}>
                  <td>{nota.produtoId}</td>
                  <td>{nota.quantidade}</td>
                  <td>R$ {nota.total.toFixed(2)}</td>
                  <td>{new Date(nota.data).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination 
          currentPage={filterValues.currentPage}
          totalPages={totalPages}
          itemsPerPage={filterValues.itemsPerPage}
          totalItems={filteredNotas.length}
          startIndex={startIndex}
          onPageChange={(page: number) => setFilterValues(prev => ({ ...prev, currentPage: page }))}
          onItemsPerPageChange={(itemsPerPage: number) => setFilterValues(prev => ({ ...prev, itemsPerPage, currentPage: 1 }))}
        />
      </div>
    </div>
  );
};

export default NotasPage;