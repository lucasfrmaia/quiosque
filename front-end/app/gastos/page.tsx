'use client';

import { FC, useState } from 'react';
import { GastoDiario } from '../../types/interfaces/interfaces';
import { Pagination } from '@/app/_components/Pagination';
import { TextFilter } from '@/app/_components/filtros/TextFilter';
import { NumberRangeFilter } from '@/app/_components/filtros/NumberRangeFilter';
import { DateRangeFilter } from '@/app/_components/filtros/DateRangeFilter';
import { Modal } from '@/app/_components/Modal';
import { PageHeader } from '@/app/_components/common/PageHeader';
import { FilterContainer } from '@/app/_components/common/FilterContainer';
import { DeleteModal } from '@/app/_components/common/DeleteModal';
import { GastosForm } from '@/app/_components/gastos/GastosForm';
import { GastosTable } from '@/app/_components/gastos/GastosTable';
import { useGastos } from '@/app/_components/gastos/useGastos';
import { ModalActions } from '@/app/_components/common/ModalActions';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';

const GastosPage: FC = () => {
  const {
    paginatedGastos,
    filteredGastos,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
    setAppliedFilters
  } = useGastos();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState<GastoDiario | null>(null);
  const [formData, setFormData] = useState({ descricao: '', valor: '', data: '' });

  const handleSubmitCreate = () => {
    handleCreate({
      descricao: formData.descricao,
      valor: Number(formData.valor),
      data: formData.data,
    });
    setIsCreateModalOpen(false);
    setFormData({ descricao: '', valor: '', data: '' });
  };

  const handleSubmitEdit = () => {
    if (!selectedGasto) return;
    handleEdit(selectedGasto.id, {
      descricao: formData.descricao,
      valor: Number(formData.valor),
      data: formData.data,
    });
    setIsEditModalOpen(false);
    setSelectedGasto(null);
    setFormData({ descricao: '', valor: '', data: '' });
  };

  const openEditModal = (gasto: GastoDiario) => {
    setSelectedGasto(gasto);
    setFormData({
      descricao: gasto.descricao,
      valor: gasto.valor.toString(),
      data: gasto.data,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (gasto: GastoDiario) => {
    setSelectedGasto(gasto);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedGasto) return;
    handleDelete(selectedGasto.id);
    setIsDeleteModalOpen(false);
    setSelectedGasto(null);
  };

  const getActiveFilters = () => {
    const active = [];
    if (filterValues.search) {
      active.push({ label: 'Descrição', value: filterValues.search });
    }
    if (filterValues.valorMin) {
      active.push({ label: 'Valor Mínimo', value: `R$ ${filterValues.valorMin}` });
    }
    if (filterValues.valorMax) {
      active.push({ label: 'Valor Máximo', value: `R$ ${filterValues.valorMax}` });
    }
    if (filterValues.dataInicio) {
      active.push({ 
        label: 'Data Inicial', 
        value: new Date(filterValues.dataInicio).toLocaleDateString() 
      });
    }
    if (filterValues.dataFim) {
      active.push({ 
        label: 'Data Final', 
        value: new Date(filterValues.dataFim).toLocaleDateString() 
      });
    }
    return active;
  };

  const handleRemoveFilter = (index: number) => {
    const activeFilters = getActiveFilters();
    const filterToRemove = activeFilters[index];
    
    switch (filterToRemove.label) {
      case 'Descrição':
        handleFilter({ search: '' });
        break;
      case 'Valor Mínimo':
        handleFilter({ valorMin: '' });
        break;
      case 'Valor Máximo':
        handleFilter({ valorMax: '' });
        break;
      case 'Data Inicial':
        handleFilter({ dataInicio: '' });
        break;
      case 'Data Final':
        handleFilter({ dataFim: '' });
        break;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gastos Diários"
        onCreateClick={() => setIsCreateModalOpen(true)}
        createButtonLabel="Novo Gasto"
      />

      <FilterContainer
        title="Filtros de Gastos"
        description="Filtre os gastos por descrição, valor ou período"
        onReset={() => {
          setAppliedFilters({
            search: '',
            valorMin: '',
            valorMax: '',
            dataInicio: '',
            dataFim: '',
            currentPage: 1,
            itemsPerPage: 10,
            sortField: 'data',
            sortDirection: 'desc'
          });
          handleFilter({
            search: '',
            valorMin: '',
            valorMax: '',
            dataInicio: '',
            dataFim: '',
            currentPage: 1
          });
        }}
        onApply={() => setAppliedFilters(filterValues)}
      >
        <TextFilter
          value={filterValues.search}
          onChange={(search) => handleFilter({ search })}
          placeholder="Pesquisar por descrição..."
          label="Busca por Descrição"
          description="Digite a descrição do gasto que deseja encontrar"
        />
          
        <NumberRangeFilter
          minValue={filterValues.valorMin}
          maxValue={filterValues.valorMax}
          onMinChange={(valorMin) => handleFilter({ valorMin })}
          onMaxChange={(valorMax) => handleFilter({ valorMax })}
          minPlaceholder="Valor mínimo"
          maxPlaceholder="Valor máximo"
          label="Faixa de Valor"
          description="Filtre gastos por faixa de valor"
        />
        
        <DateRangeFilter
          startDate={filterValues.dataInicio}
          endDate={filterValues.dataFim}
          onStartDateChange={(dataInicio) => handleFilter({ dataInicio })}
          onEndDateChange={(dataFim) => handleFilter({ dataFim })}
          label="Período"
          description="Selecione o intervalo de datas dos gastos"
        />
      </FilterContainer>

      <ActiveFilters
        filters={getActiveFilters()}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={() => handleFilter({
          search: '',
          valorMin: '',
          valorMax: '',
          dataInicio: '',
          dataFim: '',
          currentPage: 1,
        })}
      />

      <div className="bg-white p-4 rounded-lg shadow">
        <GastosTable
          items={paginatedGastos}
          filterValues={filterValues}
          onSort={handleSort}
          onEdit={openEditModal}
          onDelete={(id) => {
            const gasto = paginatedGastos.find(g => g.id === id);
            if (gasto) openDeleteModal(gasto);
          }}
        />

        <Pagination
          currentPage={filterValues.currentPage}
          totalPages={Math.ceil(filteredGastos.length / filterValues.itemsPerPage)}
          itemsPerPage={filterValues.itemsPerPage}
          totalItems={filteredGastos.length}
          startIndex={(filterValues.currentPage - 1) * filterValues.itemsPerPage}
          onPageChange={(page) => handleFilter({ currentPage: page })}
          onItemsPerPageChange={(itemsPerPage) => handleFilter({ itemsPerPage, currentPage: 1 })}
        />
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Novo Gasto">
        <div className="space-y-4">
          <GastosForm formData={formData} onChange={setFormData} />
          <ModalActions
            onCancel={() => setIsCreateModalOpen(false)}
            onConfirm={handleSubmitCreate}
            confirmLabel="Criar"
          />
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Gasto">
        <div className="space-y-4">
          <GastosForm formData={formData} onChange={setFormData} />
          <ModalActions
            onCancel={() => setIsEditModalOpen(false)}
            onConfirm={handleSubmitEdit}
            confirmLabel="Salvar"
          />
        </div>
      </Modal>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedGasto?.descricao || ''}
        itemType="Gasto"
      />
    </div>
  );
};

export default GastosPage;