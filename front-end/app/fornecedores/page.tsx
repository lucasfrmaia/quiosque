'use client';

import { FC, useState } from 'react';
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
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';

const FornecedoresPage: FC = () => {
  const {
    fornecedores,
    filteredFornecedores,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
    handleReset,
  } = useFornecedor();

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
    if (filterValues.search) {
      active.push({ label: 'Nome', value: filterValues.search });
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
    }
  };

  const resetFilters = () => {
    handleReset();
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
          >
            <TextFilter
              value={filterValues.search}
              onChange={(search) => handleFilter({ search })}
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
            items={filteredFornecedores}
            filterValues={filterValues}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(id) => {
              const fornecedor = filteredFornecedores.find(f => f.id === id);
              if (fornecedor) openDeleteModal(fornecedor);
            }}
          />

          <Pagination
            currentPage={filterValues.currentPage}
            totalPages={Math.ceil(filteredFornecedores.length / filterValues.itemsPerPage)}
            itemsPerPage={filterValues.itemsPerPage}
            totalItems={filteredFornecedores.length}
            startIndex={(filterValues.currentPage - 1) * filterValues.itemsPerPage}
            onPageChange={(page) => handleFilter({ currentPage: page })}
            onItemsPerPageChange={(itemsPerPage) => handleFilter({ itemsPerPage, currentPage: 1 })}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo Fornecedor</DialogTitle>
            <DialogDescription>Crie um novo fornecedor.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate} className="space-y-4 py-4">
            <FornecedorForm register={createForm.register} />
          </form>
          <DialogFooter>
            <Button type="submit">Criar</Button>
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Fornecedor</DialogTitle>
            <DialogDescription>Edite o fornecedor.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4 py-4">
            <FornecedorForm register={editForm.register} editing={true} />
          </form>
          <DialogFooter>
            <Button type="submit">Salvar</Button>
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o fornecedor "{selectedFornecedor?.nome}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FornecedoresPage;