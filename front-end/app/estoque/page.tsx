'use client';

import { FC, useState } from 'react';
import { Estoque } from '../../types/interfaces/entities';
import { Pagination } from '@/app/_components/Pagination';
import { TextFilter } from '@/app/_components/filtros/TextFilter';
import { NumberRangeFilter } from '@/app/_components/filtros/NumberRangeFilter';
import { Modal } from '@/app/_components/Modal';
import { PageHeader } from '@/app/_components/common/PageHeader';
import { FilterContainer } from '@/app/_components/common/FilterContainer';
import { DeleteModal } from '@/app/_components/common/DeleteModal';
import { EstoqueForm } from '@/app/_components/estoque/EstoqueForm';
import { EstoqueTable } from '@/app/_components/estoque/EstoqueTable';
import { useEstoque } from '@/app/_components/hooks/useEstoque';
import { ModalActions } from '@/app/_components/common/ModalActions';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';

const EstoquePage: FC = () => {
  const {
    paginatedEstoque,
    filteredEstoque,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
    setAppliedFilters
  } = useEstoque();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Estoque | null>(null);
  const [formData, setFormData] = useState({ nome: '', quantidade: '', precoUnitario: '', categoria: '', dataValidade: '', produtoId: '' });

  const handleSubmitCreate = () => {
    handleCreate({
      nome: formData.nome,
      quantidade: Number(formData.quantidade),
      precoUnitario: Number(formData.precoUnitario),
      categoria: formData.categoria,
      dataValidade: formData.dataValidade,
      produtoId: Number(formData.produtoId),
    });
    setIsCreateModalOpen(false);
    setFormData({ nome: '', quantidade: '', precoUnitario: '', categoria: '', dataValidade: '', produtoId: '' });
  };

  const handleSubmitEdit = () => {
    if (!selectedItem) return;
    handleEdit(selectedItem.id, {
      nome: formData.nome,
      quantidade: Number(formData.quantidade),
      precoUnitario: Number(formData.precoUnitario),
      categoria: formData.categoria,
      dataValidade: formData.dataValidade,
      produtoId: Number(formData.produtoId),
    });
    setIsEditModalOpen(false);
    setSelectedItem(null);
    setFormData({ nome: '', quantidade: '', precoUnitario: '', categoria: '', dataValidade: '', produtoId: '' });
  };

  const openEditModal = (item: Estoque) => {
    setSelectedItem(item);
    setFormData({
      nome: item.nome,
      quantidade: item.quantidade.toString(),
      precoUnitario: item.precoUnitario.toString(),
      categoria: item.categoria,
      dataValidade: item.dataValidade,
      produtoId: item.produtoId.toString(),
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (item: Estoque) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    handleDelete(selectedItem.id);
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const getActiveFilters = () => {
    const active = [];
    if (filterValues.search) {
      active.push({ label: 'Nome', value: filterValues.search });
    }
    if (filterValues.quantidadeMin) {
      active.push({ label: 'Quantidade Mínima', value: filterValues.quantidadeMin });
    }
    if (filterValues.quantidadeMax) {
      active.push({ label: 'Quantidade Máxima', value: filterValues.quantidadeMax });
    }
    if (filterValues.precoMin) {
      active.push({ label: 'Preço Mínimo', value: `R$ ${filterValues.precoMin}` });
    }
    if (filterValues.precoMax) {
      active.push({ label: 'Preço Máximo', value: `R$ ${filterValues.precoMax}` });
    }
    return active;
  };

  const handleRemoveFilter = (index: number) => {
    const activeFilters = getActiveFilters();
    const filterToRemove = activeFilters[index];
    
    switch (filterToRemove.label) {
      case 'Nome':
        handleFilter({ search: '' });
        break;
      case 'Quantidade Mínima':
        handleFilter({ quantidadeMin: '' });
        break;
      case 'Quantidade Máxima':
        handleFilter({ quantidadeMax: '' });
        break;
      case 'Preço Mínimo':
        handleFilter({ precoMin: '' });
        break;
      case 'Preço Máximo':
        handleFilter({ precoMax: '' });
        break;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Estoque"
        onCreateClick={() => setIsCreateModalOpen(true)}
        createButtonLabel="Novo Item"
      />

      <FilterContainer
        title="Filtros do Estoque"
        description="Filtre os itens do estoque por nome, quantidade ou preço"
        onReset={() => {
          setAppliedFilters({
            search: '',
            quantidadeMin: '',
            quantidadeMax: '',
            precoMin: '',
            precoMax: '',
            currentPage: 1,
            itemsPerPage: 10,
            sortField: 'nome',
            sortDirection: 'asc'
          });
          handleFilter({
            search: '',
            quantidadeMin: '',
            quantidadeMax: '',
            precoMin: '',
            precoMax: '',
            currentPage: 1
          });
        }}
        onApply={() => setAppliedFilters(filterValues)}
      >
        <TextFilter
          value={filterValues.search}
          onChange={(search) => handleFilter({ search })}
          placeholder="Pesquisar itens..."
          label="Busca por Nome"
          description="Digite o nome do item que deseja encontrar"
        />
        <NumberRangeFilter
          minValue={filterValues.quantidadeMin}
          maxValue={filterValues.quantidadeMax}
          onMinChange={(quantidadeMin) => handleFilter({ quantidadeMin })}
          onMaxChange={(quantidadeMax) => handleFilter({ quantidadeMax })}
          minPlaceholder="Quantidade mínima"
          maxPlaceholder="Quantidade máxima"
          label="Quantidade em Estoque"
          description="Filtre por faixa de quantidade disponível"
        />
        <NumberRangeFilter
          minValue={filterValues.precoMin}
          maxValue={filterValues.precoMax}
          onMinChange={(precoMin) => handleFilter({ precoMin })}
          onMaxChange={(precoMax) => handleFilter({ precoMax })}
          minPlaceholder="Preço mínimo"
          maxPlaceholder="Preço máximo"
          label="Faixa de Preço"
          description="Filtre por faixa de preço dos itens"
        />
      </FilterContainer>

      <ActiveFilters
        filters={getActiveFilters()}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={() => handleFilter({
          search: '',
          quantidadeMin: '',
          quantidadeMax: '',
          precoMin: '',
          precoMax: '',
          currentPage: 1,
        })}
      />

      <div className="bg-white p-4 rounded-lg shadow">
        <EstoqueTable
          items={paginatedEstoque}
          filterValues={filterValues}
          onSort={handleSort}
          onEdit={openEditModal}
          onDelete={(id) => {
            const item = paginatedEstoque.find(i => i.id === id);
            if (item) openDeleteModal(item);
          }}
        />

        <Pagination
          currentPage={filterValues.currentPage}
          totalPages={Math.ceil(filteredEstoque.length / filterValues.itemsPerPage)}
          itemsPerPage={filterValues.itemsPerPage}
          totalItems={filteredEstoque.length}
          startIndex={(filterValues.currentPage - 1) * filterValues.itemsPerPage}
          onPageChange={(page) => handleFilter({ currentPage: page })}
          onItemsPerPageChange={(itemsPerPage) => handleFilter({ itemsPerPage, currentPage: 1 })}
        />
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Novo Item">
        <div className="space-y-4">
          <EstoqueForm formData={formData} onChange={setFormData} />
          <ModalActions
            onCancel={() => setIsCreateModalOpen(false)}
            onConfirm={handleSubmitCreate}
            confirmLabel="Criar"
          />
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Item">
        <div className="space-y-4">
          <EstoqueForm formData={formData} onChange={setFormData} />
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
        itemName={selectedItem?.nome || ''}
        itemType="Item"
      />
    </div>
  );
};

export default EstoquePage;