'use client';

import { FC, useEffect, useState, useCallback } from 'react';
import { Produto } from '../interfaces';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '@/app/_components/Pagination';
import { SortIcon } from '../_components/SortIcon';
import { TextFilter } from '../_components/filtros/TextFilter';
import { NumberRangeFilter } from '../_components/filtros/NumberRangeFilter';

const produtos: Produto[] = [
  { id: 1, nome: 'Produto 1', preco: 10, descricao: 'Descrição do Produto 1' },
  { id: 2, nome: 'Produto 2', preco: 20, descricao: 'Descrição do Produto 2' },
  { id: 3, nome: 'Café', preco: 5, descricao: 'Café quente' },
  { id: 4, nome: 'Suco Natural', preco: 8, descricao: 'Suco de laranja natural' },
  { id: 5, nome: 'Sanduíche', preco: 15, descricao: 'Sanduíche natural' },
];

type SortableFields = 'nome' | 'preco';
type SortDirection = 'asc' | 'desc';

interface FilterValues {
  search: string;
  precoMin: string;
  precoMax: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: SortableFields;
  sortDirection: SortDirection;
}

const CardapioPage: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: searchParams.get('search') || '',
    precoMin: searchParams.get('precoMin') || '',
    precoMax: searchParams.get('precoMax') || '',
    currentPage: Number(searchParams.get('page')) || 1,
    itemsPerPage: Number(searchParams.get('limit')) || 5,
    sortField: (searchParams.get('sort') as SortableFields) || 'nome',
    sortDirection: searchParams.get('order') === 'desc' ? 'desc' : 'asc'
  });

  const [filteredProdutos, setFilteredProdutos] = useState(produtos);

  const applyFilters = useCallback(() => {
    let filtered = [...produtos];

    if (filterValues.search) {
      filtered = filtered.filter(produto =>
        produto.nome.toLowerCase().includes(filterValues.search.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(filterValues.search.toLowerCase())
      );
    }

    if (filterValues.precoMin) {
      filtered = filtered.filter(produto => produto.preco >= Number(filterValues.precoMin));
    }

    if (filterValues.precoMax) {
      filtered = filtered.filter(produto => produto.preco <= Number(filterValues.precoMax));
    }

    filtered.sort((a, b) => {
      const direction = filterValues.sortDirection === 'asc' ? 1 : -1;
      if (filterValues.sortField === 'preco') {
        return (a.preco - b.preco) * direction;
      }
      return a[filterValues.sortField].toString().localeCompare(b[filterValues.sortField].toString()) * direction;
    });

    setFilteredProdutos(filtered);
    
    const params = new URLSearchParams();
    if (filterValues.search) params.set('search', filterValues.search);
    if (filterValues.precoMin) params.set('precoMin', filterValues.precoMin);
    if (filterValues.precoMax) params.set('precoMax', filterValues.precoMax);
    if (filterValues.currentPage > 1) params.set('page', filterValues.currentPage.toString());
    if (filterValues.itemsPerPage !== 5) params.set('limit', filterValues.itemsPerPage.toString());
    if (filterValues.sortField !== 'nome') params.set('sort', filterValues.sortField);
    if (filterValues.sortDirection !== 'asc') params.set('order', filterValues.sortDirection);
    router.push(`?${params.toString()}`);
  }, [filterValues, router]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    const defaultValues: FilterValues = {
      search: '',
      precoMin: '',
      precoMax: '',
      currentPage: 1,
      itemsPerPage: 5,
      sortField: 'nome',
      sortDirection: 'asc'
    };
    setFilterValues(defaultValues);
    router.push('');
    setFilteredProdutos(produtos);
  };

  const handleSort = (field: SortableFields) => {
    setFilterValues(prev => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  const totalPages = Math.ceil(filteredProdutos.length / filterValues.itemsPerPage);
  const startIndex = (filterValues.currentPage - 1) * filterValues.itemsPerPage;
  const paginatedProdutos = filteredProdutos.slice(startIndex, startIndex + filterValues.itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Cardápio</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextFilter
            value={filterValues.search}
            onChange={(value) => setFilterValues(prev => ({
              ...prev,
              search: value,
              currentPage: 1
            }))}
            placeholder="Pesquisar produtos..."
          />
          <div className="col-span-2">
            <NumberRangeFilter
              minValue={filterValues.precoMin}
              maxValue={filterValues.precoMax}
              onMinChange={(value) => setFilterValues(prev => ({
                ...prev,
                precoMin: value,
                currentPage: 1
              }))}
              onMaxChange={(value) => setFilterValues(prev => ({
                ...prev,
                precoMax: value,
                currentPage: 1
              }))}
              minPlaceholder="Preço mínimo"
              maxPlaceholder="Preço máximo"
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
            <thead className="bg-gray-50">
              <tr>
                <th onClick={() => handleSort('nome')}>
                  <div className="flex items-center space-x-1">
                    <span>Nome</span>
                    <SortIcon 
                      field="nome"
                      currentSortField={filterValues.sortField}
                      currentSortDirection={filterValues.sortDirection}
                    />
                  </div>
                </th>
                <th onClick={() => handleSort('preco')}>
                  <div className="flex items-center space-x-1">
                    <span>Preço</span>
                    <SortIcon 
                      field="preco"
                      currentSortField={filterValues.sortField}
                      currentSortDirection={filterValues.sortDirection}
                    />
                  </div>
                </th>
                <th>
                  <div className="flex items-center space-x-1">
                    <span>Descrição</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedProdutos.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    {produto.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    R$ {produto.preco.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {produto.descricao}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination 
          currentPage={filterValues.currentPage}
          totalPages={totalPages}
          itemsPerPage={filterValues.itemsPerPage}
          totalItems={filteredProdutos.length}
          startIndex={startIndex}
          onPageChange={(page: number) => setFilterValues(prev => ({ ...prev, currentPage: page }))}
          onItemsPerPageChange={(itemsPerPage: number) => setFilterValues(prev => ({ ...prev, itemsPerPage, currentPage: 1 }))}
        />
      </div>
    </div>
  );
};

export default CardapioPage;