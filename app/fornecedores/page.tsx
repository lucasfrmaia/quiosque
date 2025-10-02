'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, User, Plus, X } from 'lucide-react';
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
import { FornecedorTable } from '@/app/_components/tables/FornecedorTable';
import { useFornecedor } from '@/app/_components/hooks/useFornecedor';

import { ModalCreateFornecedor } from '../_components/modals/fornecedores/ModalCreateFornecedor';
import { ModalEditFornecedor } from '../_components/modals/fornecedores/ModalEditFornecedor';
import { ModalDeleteFornecedor } from '../_components/modals/fornecedores/ModalDeleteFornecedor';
import { FornecedorSchema } from '@/types/validation';
import TableSkeleton from '../_components/skeletons/TableSkeleton';

const FornecedoresPage: FC = () => {

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null);
  const [localSearch, setLocalSearch] = useState('');

  const createForm = useForm<FornecedorSchema>({ defaultValues: { nome: '', cnpj: '', telefone: '', email: '' } });
  const editForm = useForm<FornecedorSchema>({ defaultValues: { nome: '', cnpj: '', telefone: '', email: '' } });

  const {
    fornecedorQuery,
    handleCreate,
    handleEdit,
    handleDelete,
    handleItemsPerPageChange,
    handlePageChange,
    handleSort,
    updateUrl,
    appliedFilters,
    resetFilters
  } = useFornecedor();

  const { data: response, isLoading, error } = fornecedorQuery;

  useEffect(() => {
    setLocalSearch(appliedFilters.search || '');
  }, [appliedFilters.search]);

  const handleSearch = useCallback(() => {
    const newFilters = { ...appliedFilters, search: localSearch, currentPage: 1 };
    updateUrl(newFilters);
  }, [appliedFilters, localSearch, updateUrl]);


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

  if (isLoading) return <TableSkeleton/>;
  if (error) return <p>Erro!</p>;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center">
          <User className="h-8 w-8 text-green-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Fornecedores</h1>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Adicionar Fornecedor
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mx-auto max-w-4xl mb-6">
        <div className="relative flex items-center justify-center gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar fornecedores por nome, CNPJ ou email..."
              value={localSearch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLocalSearch(e.target.value);
              }}
              className="pl-10 pr-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 shadow-sm hover:border-green-300 transition-all duration-200"
            />
            {localSearch && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => {
                  setLocalSearch('');
                  const newFilters = { ...appliedFilters, search: '', currentPage: 1 };
                  updateUrl(newFilters);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-9 px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4 mr-1" />
              Buscar
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={resetFilters}
            className="rounded-xl border-2 border-green-300 hover:bg-green-50 hover:border-green-500 flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-200"
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <FornecedorTable
            items={response?.fornecedores || []}
            filterValues={appliedFilters}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(fornecedorSelected) => {
              const fornecedor = response?.fornecedores.find((f: Fornecedor) => f.id === fornecedorSelected.id);
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