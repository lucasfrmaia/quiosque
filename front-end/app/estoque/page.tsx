'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SortDirection } from '@/types/interfaces/entities';
import { useForm, FormProvider } from 'react-hook-form';
import { ProdutoEstoque, FilterValues } from '@/types/interfaces/entities';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pagination } from '@/app/_components/Pagination';
import { TextFilter } from '@/app/_components/filtros/TextFilter';
import { NumberRangeFilter } from '@/app/_components/filtros/NumberRangeFilter';
import { PageHeader } from '@/app/_components/common/PageHeader';
import { FilterContainer } from '@/app/_components/common/FilterContainer';
import { EstoqueForm, EstoqueFormData } from '@/app/_components/estoque/EstoqueForm';
import { EstoqueTable } from '@/app/_components/estoque/EstoqueTable';
import { useEstoque } from '@/app/_components/hooks/useEstoque';

const defaultFilters: FilterValues = {
  currentPage: 1,
  itemsPerPage: 10,
  sortField: 'produto.nome',
  sortDirection: 'asc' as SortDirection,
  search: '',
  quantidadeMin: '',
  quantidadeMax: '',
  precoMin: '',
  precoMax: '',
};
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';
import { ModalEstoqueCreate } from '../_components/modals/estoque/ModalEstoqueCreate';
import { ModalEditEstoque } from '../_components/modals/estoque/ModalEditEstoque';
import { Modal } from '../_components/Modal';
import { ModalDeleteEstoque } from '../_components/modals/estoque/ModalDeleteEstoque';

const EstoquePage: FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getFiltersFromParams = useCallback((): FilterValues => {
    const params = new URLSearchParams(searchParams.toString());
    return {
      ...defaultFilters,
      currentPage: parseInt(params.get('page') || defaultFilters.currentPage.toString()) || defaultFilters.currentPage,
      itemsPerPage: parseInt(params.get('limit') || defaultFilters.itemsPerPage.toString()) || defaultFilters.itemsPerPage,
      sortField: params.get('sortField') || defaultFilters.sortField,
      sortDirection: (params.get('sortDirection') as SortDirection) || defaultFilters.sortDirection,
      search: params.get('search') || defaultFilters.search,
      quantidadeMin: params.get('quantidadeMin') || defaultFilters.quantidadeMin,
      quantidadeMax: params.get('quantidadeMax') || defaultFilters.quantidadeMax,
      precoMin: params.get('precoMin') || defaultFilters.precoMin,
      precoMax: params.get('precoMax') || defaultFilters.precoMax,
    };
  }, [searchParams]);

  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(getFiltersFromParams());
  const [pendingFilters, setPendingFilters] = useState<FilterValues>(appliedFilters);

  useEffect(() => {
    setPendingFilters(appliedFilters);
  }, [appliedFilters]);

  const { estoque, total, produtos, isLoading, handleCreate, handleEdit, handleDelete } = useEstoque(appliedFilters);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProdutoEstoque | null>(null);
  const createForm = useForm<EstoqueFormData>({
    defaultValues: {
      preco: '',
      quantidade: '',
      dataValidade: '',
      unidade: '',
      produtoId: '',
    }
  });

  const editForm = useForm<EstoqueFormData>({
    defaultValues: {
      preco: '',
      quantidade: '',
      dataValidade: '',
      unidade: '',
      produtoId: '',
    }
  });

  const handleSubmitCreate = createForm.handleSubmit((data) => {
    handleCreate({
      preco: Number(data.preco),
      quantidade: Number(data.quantidade),
      dataValidade: data.dataValidade,
      unidade: data.unidade,
      produtoId: Number(data.produtoId),
    });
    setIsCreateModalOpen(false);
    createForm.reset();
  });

  const handleSubmitEdit = editForm.handleSubmit((data) => {
    if (!selectedItem) return;
    handleEdit(selectedItem.id, {
      preco: Number(data.preco),
      quantidade: Number(data.quantidade),
      dataValidade: data.dataValidade,
      unidade: data.unidade,
      produtoId: Number(data.produtoId),
    });
    setIsEditModalOpen(false);
    setSelectedItem(null);
    editForm.reset();
  });

  const openEditModal = (item: ProdutoEstoque) => {
    setSelectedItem(item);
    editForm.setValue('preco', item.preco.toString());
    editForm.setValue('quantidade', item.quantidade.toString());
    editForm.setValue('dataValidade', item.dataValidade || '');
    editForm.setValue('unidade', item.unidade);
    editForm.setValue('produtoId', item.produtoId.toString());
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (item: ProdutoEstoque) => {
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
    if (appliedFilters.search) {
      active.push({ label: 'Nome', value: appliedFilters.search });
    }
    if (appliedFilters.quantidadeMin) {
      active.push({ label: 'Quantidade Mínima', value: appliedFilters.quantidadeMin });
    }
    if (appliedFilters.quantidadeMax) {
      active.push({ label: 'Quantidade Máxima', value: appliedFilters.quantidadeMax });
    }
    if (appliedFilters.precoMin) {
      active.push({ label: 'Preço Mínimo', value: `R$ ${appliedFilters.precoMin}` });
    }
    if (appliedFilters.precoMax) {
      active.push({ label: 'Preço Máximo', value: `R$ ${appliedFilters.precoMax}` });
    }
    return active;
  };

  const updateUrl = useCallback((newFilters: FilterValues) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newFilters.currentPage.toString());
    params.set('limit', newFilters.itemsPerPage.toString());
    params.set('sortField', newFilters.sortField);
    params.set('sortDirection', newFilters.sortDirection);
    if (newFilters.search) {
      params.set('search', newFilters.search);
    } else {
      params.delete('search');
    }
    if (newFilters.quantidadeMin) {
      params.set('quantidadeMin', newFilters.quantidadeMin);
    } else {
      params.delete('quantidadeMin');
    }
    if (newFilters.quantidadeMax) {
      params.set('quantidadeMax', newFilters.quantidadeMax);
    } else {
      params.delete('quantidadeMax');
    }
    if (newFilters.precoMin) {
      params.set('precoMin', newFilters.precoMin);
    } else {
      params.delete('precoMin');
    }
    if (newFilters.precoMax) {
      params.set('precoMax', newFilters.precoMax);
    } else {
      params.delete('precoMax');
    }
    router.replace(`?${params.toString()}`);
  }, [router, searchParams]);

  const handleApply = () => {
    const newFilters = { ...pendingFilters, currentPage: 1 };
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleRemoveFilter = (index: number) => {
    const activeFilters = getActiveFilters();
    const filterToRemove = activeFilters[index];

    let newFilters = { ...appliedFilters };
    switch (filterToRemove.label) {
      case 'Nome':
        newFilters = { ...newFilters, search: '' };
        break;
      case 'Quantidade Mínima':
        newFilters = { ...newFilters, quantidadeMin: '' };
        break;
      case 'Quantidade Máxima':
        newFilters = { ...newFilters, quantidadeMax: '' };
        break;
      case 'Preço Mínimo':
        newFilters = { ...newFilters, precoMin: '' };
        break;
      case 'Preço Máximo':
        newFilters = { ...newFilters, precoMax: '' };
        break;
    }
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
  };

  const resetFilters = () => {
    setPendingFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    const params = new URLSearchParams();
    router.replace(`?${params.toString()}`);
  };

  const handleSort = (field: string) => {
    const newDirection = appliedFilters.sortField === field && appliedFilters.sortDirection === 'asc' ? 'desc' : 'asc';
    const newFilters = { ...appliedFilters, sortField: field, sortDirection: newDirection as SortDirection, currentPage: 1 };
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...appliedFilters, currentPage: page };
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    const newFilters = { ...appliedFilters, itemsPerPage, currentPage: 1 };
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Estoque</CardTitle>
            <CardDescription>Gerencie os itens do seu estoque</CardDescription>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Novo Item</Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os itens do estoque por nome, quantidade ou preço</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterContainer
            title=""
            description=""
            onReset={resetFilters}
            onApply={handleApply}
          >
            <TextFilter
              value={pendingFilters.search}
              onChange={(search) => setPendingFilters(prev => ({ ...prev, search }))}
              placeholder="Pesquisar itens..."
              label="Busca por Nome"
              description="Digite o nome do produto que deseja encontrar"
            />
            <NumberRangeFilter
              minValue={pendingFilters.quantidadeMin}
              maxValue={pendingFilters.quantidadeMax}
              onMinChange={(quantidadeMin) => setPendingFilters(prev => ({ ...prev, quantidadeMin }))}
              onMaxChange={(quantidadeMax) => setPendingFilters(prev => ({ ...prev, quantidadeMax }))}
              minPlaceholder="Quantidade mínima"
              maxPlaceholder="Quantidade máxima"
              label="Quantidade em Estoque"
              description="Filtre por faixa de quantidade disponível"
            />
            <NumberRangeFilter
              minValue={pendingFilters.precoMin}
              maxValue={pendingFilters.precoMax}
              onMinChange={(precoMin) => setPendingFilters(prev => ({ ...prev, precoMin }))}
              onMaxChange={(precoMax) => setPendingFilters(prev => ({ ...prev, precoMax }))}
              minPlaceholder="Preço mínimo"
              maxPlaceholder="Preço máximo"
              label="Faixa de Preço"
              description="Filtre por faixa de preço dos itens"
            />
          </FilterContainer>
        </CardContent>
      </Card>

      <ActiveFilters
        filters={getActiveFilters()}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={resetFilters}
      />

      <Card>
        <CardContent className="pt-6">
          <EstoqueTable
            items={estoque}
            filterValues={appliedFilters}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(id) => {
              const item = estoque.find(i => i.id === id);
              if (item) openDeleteModal(item);
            }}
          />

          <div className="mt-6">
            <Pagination
              currentPage={appliedFilters.currentPage}
              totalPages={Math.ceil((total || 0) / appliedFilters.itemsPerPage)}
              itemsPerPage={appliedFilters.itemsPerPage}
              totalItems={total || 0}
              startIndex={(appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <ModalEstoqueCreate
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        handleSubmitCreate={handleSubmitCreate}
        createForm={createForm}
        produtos={produtos}
      />

      {/* Edit Dialog */}
      <ModalEditEstoque
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        handleSubmitEdit={handleSubmitEdit}
        editForm={editForm}
        produtos={produtos}
      />

      {/* Delete Dialog */}
      <ModalDeleteEstoque
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        selectedItem={selectedItem}
        handleDeleteConfirm={handleDeleteConfirm}
      />

    </div>
  );
};

export default EstoquePage;