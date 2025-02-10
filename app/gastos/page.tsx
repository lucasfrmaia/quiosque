'use client';

import { FC, useEffect, useState, useCallback } from 'react';
import { GastoDiario } from '../interfaces';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '@/app/_components/Pagination';
import { SortIcon } from '../_components/SortIcon';
import { TextFilter } from '../_components/filtros/TextFilter';
import { NumberRangeFilter } from '..//_components/filtros/NumberRangeFilter';
import { DateRangeFilter } from '..//_components/filtros/DateRangeFilter';
import { Modal } from '..//_components/Modal';
import { ActionButton } from '..//_components/ActionButton';
import { CreateButton } from '..//_components/CreateButton';

const gastos: GastoDiario[] = [
  { id: 1, descricao: 'Compra de materiais', valor: 100, data: '2023-10-01' },
  { id: 2, descricao: 'Pagamento de funcionários', valor: 200, data: '2023-10-02' },
  { id: 3, descricao: 'Manutenção', valor: 150, data: '2023-10-03' },
  { id: 4, descricao: 'Produtos de limpeza', valor: 80, data: '2023-10-04' },
  { id: 5, descricao: 'Conta de luz', valor: 300, data: '2023-10-05' },
];

type SortableFields = 'descricao' | 'valor' | 'data';
type SortDirection = 'asc' | 'desc';

interface FilterValues {
  search: string;
  valorMin: string;
  valorMax: string;
  dataInicio: string;
  dataFim: string;
  currentPage: number;
  itemsPerPage: number;
  sortField: SortableFields;
  sortDirection: SortDirection;
}

interface GastoFormData {
  descricao: string;
  valor: string;
  data: string;
}

const GastosPage: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: searchParams.get('search') || '',
    valorMin: searchParams.get('valorMin') || '',
    valorMax: searchParams.get('valorMax') || '',
    dataInicio: searchParams.get('dataInicio') || '',
    dataFim: searchParams.get('dataFim') || '',
    currentPage: Number(searchParams.get('page')) || 1,
    itemsPerPage: Number(searchParams.get('limit')) || 5,
    sortField: (searchParams.get('sort') as SortableFields) || 'data',
    sortDirection: searchParams.get('order') === 'desc' ? 'desc' : 'asc'
  });

  const [filteredGastos, setFilteredGastos] = useState(gastos);
  const [selectedGasto, setSelectedGasto] = useState<GastoDiario | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<GastoFormData>({
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0]
  });

  const applyFilters = useCallback(() => {
    let filtered = [...gastos];

    if (filterValues.search) {
      filtered = filtered.filter(gasto =>
        gasto.descricao.toLowerCase().includes(filterValues.search.toLowerCase())
      );
    }

    if (filterValues.valorMin) {
      filtered = filtered.filter(gasto => gasto.valor >= Number(filterValues.valorMin));
    }

    if (filterValues.valorMax) {
      filtered = filtered.filter(gasto => gasto.valor <= Number(filterValues.valorMax));
    }

    if (filterValues.dataInicio) {
      filtered = filtered.filter(gasto => gasto.data >= filterValues.dataInicio);
    }

    if (filterValues.dataFim) {
      filtered = filtered.filter(gasto => gasto.data <= filterValues.dataFim);
    }

    filtered.sort((a, b) => {
      const direction = filterValues.sortDirection === 'asc' ? 1 : -1;
      if (filterValues.sortField === 'valor') {
        return (a.valor - b.valor) * direction;
      }
      if (filterValues.sortField === 'data') {
        return a.data.localeCompare(b.data) * direction;
      }
      return a[filterValues.sortField].toString().localeCompare(b[filterValues.sortField].toString()) * direction;
    });

    setFilteredGastos(filtered);

    const params = new URLSearchParams();
    if (filterValues.search) params.set('search', filterValues.search);
    if (filterValues.valorMin) params.set('valorMin', filterValues.valorMin);
    if (filterValues.valorMax) params.set('valorMax', filterValues.valorMax);
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
      valorMin: '',
      valorMax: '',
      dataInicio: '',
      dataFim: '',
      currentPage: 1,
      itemsPerPage: 5,
      sortField: 'data',
      sortDirection: 'desc'
    };
    setFilterValues(defaultValues);
    router.push('');
    setFilteredGastos(gastos);
  };

  const handleSort = (field: SortableFields) => {
    setFilterValues(prev => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleCreate = () => {
    const newGasto = {
      id: gastos.length + 1,
      descricao: formData.descricao,
      valor: Number(formData.valor),
      data: formData.data
    };
    gastos.push(newGasto);
    setFilteredGastos([...gastos]);
    setIsCreateModalOpen(false);
    setFormData({
      descricao: '',
      valor: '',
      data: new Date().toISOString().split('T')[0]
    });
  };

  const handleEdit = () => {
    if (!selectedGasto) return;
    const index = gastos.findIndex(g => g.id === selectedGasto.id);
    gastos[index] = {
      ...gastos[index],
      descricao: formData.descricao,
      valor: Number(formData.valor),
      data: formData.data
    };
    setFilteredGastos([...gastos]);
    setIsEditModalOpen(false);
    setSelectedGasto(null);
  };

  const handleDelete = () => {
    if (!selectedGasto) return;
    const index = gastos.findIndex(g => g.id === selectedGasto.id);
    gastos.splice(index, 1);
    setFilteredGastos([...gastos]);
    setIsDeleteModalOpen(false);
    setSelectedGasto(null);
  };

  const openEditModal = (gasto: GastoDiario) => {
    setSelectedGasto(gasto);
    setFormData({
      descricao: gasto.descricao,
      valor: gasto.valor.toString(),
      data: gasto.data
    });
    setIsEditModalOpen(true);
  };

  const totalPages = Math.ceil(filteredGastos.length / filterValues.itemsPerPage);
  const startIndex = (filterValues.currentPage - 1) * filterValues.itemsPerPage;
  const paginatedGastos = filteredGastos.slice(startIndex, startIndex + filterValues.itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Gastos Diários</h1>
        <CreateButton onClick={() => setIsCreateModalOpen(true)} label="Novo Gasto" />
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
            placeholder="Pesquisar por descrição..."
          />
          
          <NumberRangeFilter
            minValue={filterValues.valorMin}
            maxValue={filterValues.valorMax}
            onMinChange={(value) => setFilterValues(prev => ({
              ...prev,
              valorMin: value,
              currentPage: 1
            }))}
            onMaxChange={(value) => setFilterValues(prev => ({
              ...prev,
              valorMax: value,
              currentPage: 1
            }))}
            minPlaceholder="Valor mínimo"
            maxPlaceholder="Valor máximo"
          />
          
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
                <th onClick={() => handleSort('descricao')}>
                  <div className="flex items-center space-x-1">
                    <span>Descrição</span>
                    <SortIcon 
                      field="descricao"
                      currentSortField={filterValues.sortField}
                      currentSortDirection={filterValues.sortDirection}
                    />
                  </div>
                </th>
                <th onClick={() => handleSort('valor')}>
                  <div className="flex items-center space-x-1">
                    <span>Valor</span>
                    <SortIcon 
                      field="valor"
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
                <th className="w-20">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGastos.map((gasto) => (
                <tr key={gasto.id} className="hover:bg-gray-50 transition-colors">
                  <td>{gasto.descricao}</td>
                  <td>R$ {gasto.valor.toFixed(2)}</td>
                  <td>{new Date(gasto.data).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <ActionButton variant="edit" onClick={() => openEditModal(gasto)} />
                    <ActionButton
                      variant="delete"
                      onClick={() => {
                        setSelectedGasto(gasto);
                        setIsDeleteModalOpen(true);
                      }}
                    />
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
          totalItems={filteredGastos.length}
          startIndex={startIndex}
          onPageChange={(page: number) => setFilterValues(prev => ({ ...prev, currentPage: page }))}
          onItemsPerPageChange={(itemsPerPage: number) => setFilterValues(prev => ({ ...prev, itemsPerPage, currentPage: 1 }))}
        />
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Novo Gasto"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              className="filter-input"
              placeholder="Descrição do gasto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
            <input
              type="number"
              value={formData.valor}
              onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
              className="filter-input"
              placeholder="Valor do gasto"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
              className="filter-input"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Gasto"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              className="filter-input"
              placeholder="Descrição do gasto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
            <input
              type="number"
              value={formData.valor}
              onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
              className="filter-input"
              placeholder="Valor do gasto"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
              className="filter-input"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Gasto"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Tem certeza que deseja excluir o gasto &quot;{selectedGasto?.descricao}&quot;?
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GastosPage;