'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
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
import { FornecedorTable } from '@/app/_components/fornecedor/FornecedorTable';
import { useFornecedor } from '@/app/_components/hooks/useFornecedor';

import { ModalCreateFornecedor } from '../_components/modals/fornecedores/ModalCreateFornecedor';
import { ModalEditFornecedor } from '../_components/modals/fornecedores/ModalEditFornecedor';
import { ModalDeleteFornecedor } from '../_components/modals/fornecedores/ModalDeleteFornecedor';
import { FornecedorSchema } from '@/types/validation';

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

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro!</p>;

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

      {/* Search Bar */}
      <Card className="border-green-100 shadow-sm">
        <CardContent className="p-4">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar fornecedores..."
                value={localSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setLocalSearch(e.target.value);
                }}
                className="pl-10 pr-4 rounded-xl border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 shadow-md transition-all duration-200 hover:shadow-lg"
              />
              {localSearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-9 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => {
                    setLocalSearch('');
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button onClick={handleSearch} variant="default" size="sm">
              Buscar Fornecedores
            </Button>
            <Button onClick={resetFilters} variant="outline" size="sm">
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <FornecedorTable
            items={response?.fornecedores || []}
            filterValues={appliedFilters}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(id) => {
              const fornecedor = response?.fornecedores.find((f: Fornecedor) => f.id === id);
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