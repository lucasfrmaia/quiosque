'use client';

import { FC, useState } from 'react';
import { Produto } from '../interfaces';
import { Pagination } from '@/app/_components/Pagination';
import { TextFilter } from '@/app/_components/filtros/TextFilter';
import { NumberRangeFilter } from '@/app/_components/filtros/NumberRangeFilter';
import { Modal } from '@/app/_components/Modal';
import { PageHeader } from '@/app/_components/common/PageHeader';
import { FilterContainer } from '@/app/_components/common/FilterContainer';
import { DeleteModal } from '@/app/_components/common/DeleteModal';
import { CardapioForm } from '@/app/_components/cardapio/CardapioForm';
import { CardapioTable } from '@/app/_components/cardapio/CardapioTable';
import { useCardapio } from '@/app/_components/cardapio/useCardapio';
import { ModalActions } from '@/app/_components/common/ModalActions';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';

const CardapioPage: FC = () => {
  const {
    paginatedProdutos,
    filteredProdutos,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
    setAppliedFilters
  } = useCardapio();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [formData, setFormData] = useState({ nome: '', preco: '', descricao: '' });

  const handleSubmitCreate = () => {
    handleCreate({
      nome: formData.nome,
      preco: Number(formData.preco),
      descricao: formData.descricao,
    });
    setIsCreateModalOpen(false);
    setFormData({ nome: '', preco: '', descricao: '' });
  };

  const handleSubmitEdit = () => {
    if (!selectedProduto) return;
    handleEdit(selectedProduto.id, {
      nome: formData.nome,
      preco: Number(formData.preco),
      descricao: formData.descricao,
    });
    setIsEditModalOpen(false);
    setSelectedProduto(null);
    setFormData({ nome: '', preco: '', descricao: '' });
  };

  const openEditModal = (produto: Produto) => {
    setSelectedProduto(produto);
    setFormData({
      nome: produto.nome,
      preco: produto.preco.toString(),
      descricao: produto.descricao,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (produto: Produto) => {
    setSelectedProduto(produto);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedProduto) return;
    handleDelete(selectedProduto.id);
    setIsDeleteModalOpen(false);
    setSelectedProduto(null);
  };

  const getActiveFilters = () => {
    const active = [];
    if (filterValues.search) {
      active.push({ label: 'Busca', value: filterValues.search });
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
      case 'Busca':
        handleFilter({ search: '' });
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
        title="Cardápio"
        onCreateClick={() => setIsCreateModalOpen(true)}
        createButtonLabel="Novo Produto"
      />

      <FilterContainer
        title="Filtros do Cardápio"
        description="Pesquise produtos por nome, descrição ou faixa de preço"
        onReset={() => {
          setAppliedFilters({
            search: '',
            precoMin: '',
            precoMax: '',
            currentPage: 1,
            itemsPerPage: 10,
            sortField: 'nome',
            sortDirection: 'asc'
          });
          handleFilter({
            search: '',
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
          placeholder="Pesquisar produtos..."
          label="Busca por Nome ou Descrição"
          description="Digite o nome ou descrição do produto que deseja encontrar"
        />
        <div className="col-span-2">
          <NumberRangeFilter
            minValue={filterValues.precoMin}
            maxValue={filterValues.precoMax}
            onMinChange={(precoMin) => handleFilter({ precoMin })}
            onMaxChange={(precoMax) => handleFilter({ precoMax })}
            minPlaceholder="Preço mínimo"
            maxPlaceholder="Preço máximo"
            label="Faixa de Preço"
            description="Filtre produtos por faixa de preço"
          />
        </div>
      </FilterContainer>

      <ActiveFilters
        filters={getActiveFilters()}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={() => {
          setAppliedFilters({
            search: '',
            precoMin: '',
            precoMax: '',
            currentPage: 1,
            itemsPerPage: 10,
            sortField: 'nome',
            sortDirection: 'asc'
          });
          handleFilter({
            search: '',
            precoMin: '',
            precoMax: '',
            currentPage: 1
          });
        }}
      />

      <div className="bg-white p-4 rounded-lg shadow">
        <CardapioTable
          items={paginatedProdutos}
          filterValues={filterValues}
          onSort={handleSort}
          onEdit={openEditModal}
          onDelete={(id) => {
            const produto = paginatedProdutos.find(p => p.id === id);
            if (produto) openDeleteModal(produto);
          }}
        />

        <Pagination
          currentPage={filterValues.currentPage}
          totalPages={Math.ceil(filteredProdutos.length / filterValues.itemsPerPage)}
          itemsPerPage={filterValues.itemsPerPage}
          totalItems={filteredProdutos.length}
          startIndex={(filterValues.currentPage - 1) * filterValues.itemsPerPage}
          onPageChange={(page) => handleFilter({ currentPage: page })}
          onItemsPerPageChange={(itemsPerPage) => handleFilter({ itemsPerPage, currentPage: 1 })}
        />
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Novo Produto">
        <div className="space-y-4">
          <CardapioForm formData={formData} onChange={setFormData} />
          <ModalActions
            onCancel={() => setIsCreateModalOpen(false)}
            onConfirm={handleSubmitCreate}
            confirmLabel="Criar"
          />
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Produto">
        <div className="space-y-4">
          <CardapioForm formData={formData} onChange={setFormData} />
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
        itemName={selectedProduto?.nome || ''}
        itemType="Produto"
      />
    </div>
  );
};

export default CardapioPage;