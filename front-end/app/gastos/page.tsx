'use client';

import { FC, useState } from 'react';
import { ProdutoCompra } from '../../types/interfaces/entities';
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
import { useGastos } from '@/app/_components/hooks/useGastos';
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
  const [selectedGasto, setSelectedGasto] = useState<ProdutoCompra | null>(null);
  const [formData, setFormData] = useState({ produtoId: '', quantidade: '', preco: '', unidade: '', data: '' });

  const handleSubmitCreate = () => {
    handleCreate({
      produtoId: Number(formData.produtoId),
      quantidade: Number(formData.quantidade),
      preco: Number(formData.preco),
      unidade: formData.unidade,
      data: formData.data,
    });
    setIsCreateModalOpen(false);
    setFormData({ produtoId: '', quantidade: '', preco: '', unidade: '', data: '' });
  };

  const handleSubmitEdit = () => {
    if (!selectedGasto) return;
    handleEdit(selectedGasto.id, {
      produtoId: Number(formData.produtoId),
      quantidade: Number(formData.quantidade),
      preco: Number(formData.preco),
      unidade: formData.unidade,
      data: formData.data,
    });
    setIsEditModalOpen(false);
    setSelectedGasto(null);
    setFormData({ produtoId: '', quantidade: '', preco: '', unidade: '', data: '' });
  };

  const openEditModal = (gasto: ProdutoCompra) => {
    setSelectedGasto(gasto);
    setFormData({
      produtoId: gasto.produtoId.toString(),
      quantidade: gasto.quantidade.toString(),
      preco: gasto.preco.toString(),
      unidade: gasto.unidade,
      data: gasto.data,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (gasto: ProdutoCompra) => {
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
      active.push({ label: 'Produto', value: filterValues.search });
    }
    if (filterValues.precoMin) {
      active.push({ label: 'Preço Mínimo', value: `R$ ${filterValues.precoMin}` });
    }
    if (filterValues.precoMax) {
      active.push({ label: 'Preço Máximo', value: `R$ ${filterValues.precoMax}` });
    }
    if (filterValues.quantidadeMin) {
      active.push({ label: 'Quantidade Mínima', value: filterValues.quantidadeMin });
    }
    if (filterValues.quantidadeMax) {
      active.push({ label: 'Quantidade Máxima', value: filterValues.quantidadeMax });
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
      case 'Produto':
        handleFilter({ search: '' });
        break;
      case 'Preço Mínimo':
        handleFilter({ precoMin: '' });
        break;
      case 'Preço Máximo':
        handleFilter({ precoMax: '' });
        break;
      case 'Quantidade Mínima':
        handleFilter({ quantidadeMin: '' });
        break;
      case 'Quantidade Máxima':
        handleFilter({ quantidadeMax: '' });
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
        title="Compras de Produtos"
        onCreateClick={() => setIsCreateModalOpen(true)}
        createButtonLabel="Nova Compra"
      />

      <FilterContainer
        title="Filtros de Compras"
        description="Filtre as compras por produto, preço, quantidade ou período"
        onReset={() => {
          setAppliedFilters({
            search: '',
            precoMin: '',
            precoMax: '',
            quantidadeMin: '',
            quantidadeMax: '',
            dataInicio: '',
            dataFim: '',
            currentPage: 1,
            itemsPerPage: 10,
            sortField: 'data',
            sortDirection: 'desc'
          });
          handleFilter({
            search: '',
            precoMin: '',
            precoMax: '',
            quantidadeMin: '',
            quantidadeMax: '',
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
          placeholder="Pesquisar por produto..."
          label="Busca por Produto"
          description="Digite o nome do produto que deseja encontrar"
        />
          
        <NumberRangeFilter
          minValue={filterValues.precoMin}
          maxValue={filterValues.precoMax}
          onMinChange={(precoMin) => handleFilter({ precoMin })}
          onMaxChange={(precoMax) => handleFilter({ precoMax })}
          minPlaceholder="Preço mínimo"
          maxPlaceholder="Preço máximo"
          label="Faixa de Preço"
          description="Filtre compras por faixa de preço"
        />
        
        <NumberRangeFilter
          minValue={filterValues.quantidadeMin}
          maxValue={filterValues.quantidadeMax}
          onMinChange={(quantidadeMin) => handleFilter({ quantidadeMin })}
          onMaxChange={(quantidadeMax) => handleFilter({ quantidadeMax })}
          minPlaceholder="Quantidade mínima"
          maxPlaceholder="Quantidade máxima"
          label="Faixa de Quantidade"
          description="Filtre por faixa de quantidade comprada"
        />

        <DateRangeFilter
          startDate={filterValues.dataInicio}
          endDate={filterValues.dataFim}
          onStartDateChange={(dataInicio) => handleFilter({ dataInicio })}
          onEndDateChange={(dataFim) => handleFilter({ dataFim })}
          label="Período"
          description="Selecione o intervalo de datas das compras"
        />
      </FilterContainer>

      <ActiveFilters
        filters={getActiveFilters()}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={() => handleFilter({
          search: '',
          precoMin: '',
          precoMax: '',
          quantidadeMin: '',
          quantidadeMax: '',
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

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nova Compra">
        <div className="space-y-4">
          <GastosForm formData={formData} onChange={setFormData} />
          <ModalActions
            onCancel={() => setIsCreateModalOpen(false)}
            onConfirm={handleSubmitCreate}
            confirmLabel="Criar"
          />
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Compra">
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
        itemName={selectedGasto?.produto?.nome || ''}
        itemType="Compra"
      />
    </div>
  );
};

export default GastosPage;