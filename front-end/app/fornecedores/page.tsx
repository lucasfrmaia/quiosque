'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterValues, SortDirection } from '@/types/interfaces/entities';
import { useForm } from 'react-hook-form';
import { Fornecedor } from '@/types/interfaces/entities';
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
import { FilterContainer } from '@/app/_components/common/FilterContainer';
import { FornecedorForm, FornecedorFormData } from '@/app/_components/fornecedor/FornecedorForm';
import { FornecedorTable } from '@/app/_components/fornecedor/FornecedorTable';
import { useFornecedor } from '@/app/_components/hooks/useFornecedor';

const defaultFilters: FilterValues = {
  currentPage: 1,
  itemsPerPage: 10,
  sortField: 'nome',
  sortDirection: 'asc' as SortDirection,
  search: '',
  quantidadeMin: '',
  quantidadeMax: '',
  precoMin: '',
  precoMax: '',
};
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';
import { ModalCreateFornecedor } from '../_components/modals/fornecedores/ModalCreateFornecedor';
import { ModalEditFornecedor } from '../_components/modals/fornecedores/ModalEditFornecedor';
import { Modal } from '../_components/Modal';
import { ModalDeleteFornecedor } from '../_components/modals/fornecedores/ModalDeleteFornecedor';

const FornecedoresPage: FC = () => {
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


  const appliedFilters = getFiltersFromParams();

  const { fornecedores, total, handleCreate, handleEdit, handleDelete } = useFornecedor(appliedFilters);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null);
  const createForm = useForm<FornecedorFormData>({ defaultValues: { nome: '', cnpj: '', telefone: '', email: '' } });

  const editForm = useForm<FornecedorFormData>({ defaultValues: { nome: '', cnpj: '', telefone: '', email: '' } });

  const handleSubmitCreate = createForm.handleSubmit((data) => {
    handleCreate({
      nome: data.nome,
      cnpj: data.cnpj || null,
      telefone: data.telefone || null,
      email: data.email || null,
    });
    setIsCreateModalOpen(false);
    createForm.reset();
  });

  const handleSubmitEdit = editForm.handleSubmit((data) => {
    if (!selectedFornecedor) return;
    handleEdit(selectedFornecedor.id, {
      nome: data.nome,
      cnpj: data.cnpj || null,
      telefone: data.telefone || null,
      email: data.email || null,
    });
    setIsEditModalOpen(false);
    setSelectedFornecedor(null);
    editForm.reset();
  });

  const openEditModal = (fornecedor: Fornecedor) => {
    setSelectedFornecedor(fornecedor);
    editForm.setValue('nome', fornecedor.nome);
    editForm.setValue('cnpj', fornecedor.cnpj || '');
    editForm.setValue('telefone', fornecedor.telefone || '');
    editForm.setValue('email', fornecedor.email || '');
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (fornecedor: Fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedFornecedor) return;
    handleDelete(selectedFornecedor.id);
    setIsDeleteModalOpen(false);
    setSelectedFornecedor(null);
  };

  const getActiveFilters = () => {
    const active = [];
    if (appliedFilters.search) {
      active.push({ label: 'Nome', value: appliedFilters.search });
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
    const newFilters = { ...appliedFilters, currentPage: 1 };
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
    }
    updateUrl(newFilters);
  };

  const resetFilters = () => {
    const params = new URLSearchParams();
    router.replace(`?${params.toString()}`);
  };

  const handleSort = (field: string) => {
    const newDirection = appliedFilters.sortField === field && appliedFilters.sortDirection === 'asc' ? 'desc' : 'asc';
    const newFilters = { ...appliedFilters, sortField: field, sortDirection: newDirection as SortDirection, currentPage: 1 };
    updateUrl(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...appliedFilters, currentPage: page };
    updateUrl(newFilters);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    const newFilters = { ...appliedFilters, itemsPerPage, currentPage: 1 };
    updateUrl(newFilters);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Fornecedores</CardTitle>
            <CardDescription>Gerencie os fornecedores do sistema</CardDescription>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Novo Fornecedor</Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os fornecedores por nome</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterContainer
            title=""
            description=""
            onReset={resetFilters}
            onApply={handleApply}
          >
            <TextFilter
              value={appliedFilters.search}
              onChange={(search) => {
                const newFilters = { ...appliedFilters, search, currentPage: 1 };
                updateUrl(newFilters);
              }}
              placeholder="Pesquisar por nome..."
              label="Nome"
              description="Digite o nome do fornecedor"
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
        <CardContent className="pt-6 space-y-6">
          <FornecedorTable
            items={fornecedores}
            filterValues={appliedFilters}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(id) => {
              const fornecedor = fornecedores.find(f => f.id === id);
              if (fornecedor) openDeleteModal(fornecedor);
            }}
          />

          <Pagination
            currentPage={appliedFilters.currentPage}
            totalPages={Math.ceil((total || 0) / appliedFilters.itemsPerPage)}
            itemsPerPage={appliedFilters.itemsPerPage}
            totalItems={total || 0}
            startIndex={(appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <ModalCreateFornecedor
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        createForm={createForm}
        handleSubmitCreate={handleSubmitCreate}
      />


      {/* Edit Dialog */}
      <ModalEditFornecedor
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editForm={editForm}
        handleSubmitEdit={handleSubmitEdit}
      />

      {/* Delete Dialog */}
      <ModalDeleteFornecedor
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        selectedFornecedor={selectedFornecedor}
        handleDeleteConfirm={handleDeleteConfirm}
      />

    </div>
  );
};

export default FornecedoresPage;