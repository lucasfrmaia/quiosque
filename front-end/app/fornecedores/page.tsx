'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Fornecedor } from '@/types/interfaces/entities';
import { Button } from '@/components/ui/button';
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

import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';
import { ModalCreateFornecedor } from '../_components/modals/fornecedores/ModalCreateFornecedor';
import { ModalEditFornecedor } from '../_components/modals/fornecedores/ModalEditFornecedor';
import { ModalDeleteFornecedor } from '../_components/modals/fornecedores/ModalDeleteFornecedor';

const FornecedoresPage: FC = () => {

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null);

  const createForm = useForm<FornecedorFormData>({ defaultValues: { nome: '', cnpj: '', telefone: '', email: '' } });
  const editForm = useForm<FornecedorFormData>({ defaultValues: { nome: '', cnpj: '', telefone: '', email: '' } });

  const {
    handleCreate,
    handleEdit,
    handleDelete,
    getFornecedorByParams,
    handleApply,
    handleItemsPerPageChange,
    handlePageChange,
    handleRemoveFilter,
    handleSort,
    resetFilters,
    getFiltersFromParams,
    updateUrl,
    getActiveFilters
  } = useFornecedor();

  const appliedFilters = getFiltersFromParams();
  const { data: response, isLoading, error } = getFornecedorByParams()

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

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro!</p>;

  console.log("bomba", response)

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
            items={response?.fornecedores || []}
            filterValues={appliedFilters}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(id) => {
              const fornecedor = response?.fornecedores.find(f => f.id === id);
              if (fornecedor) openDeleteModal(fornecedor);
            }}
          />

          <Pagination
            currentPage={appliedFilters.currentPage}
            totalPages={Math.ceil((response?.total || 0) / appliedFilters.itemsPerPage)}
            itemsPerPage={appliedFilters.itemsPerPage}
            totalItems={response?.total || 0}
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