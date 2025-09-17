'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Category } from '@/types/interfaces/entities';
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
import { CategoryTable } from '@/app/_components/categoria/CategoryTable';
import { CategoryForm, CategoryFormData } from '@/app/_components/categoria/CategoryForm';
import { useCategory } from '@/app/_components/hooks/useCategory';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';

const CategoriaPage: FC = () => {
  const {
    categories,
    filteredCategories,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
  } = useCategory();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const createForm = useForm<CategoryFormData>({ defaultValues: { name: '' } });
  const editForm = useForm<CategoryFormData>({ defaultValues: { name: '' } });

  const handleSubmitCreate = createForm.handleSubmit((data) => {
    handleCreate(data);
    setIsCreateModalOpen(false);
    createForm.reset();
  });

  const handleSubmitEdit = editForm.handleSubmit((data) => {
    if (!selectedCategory) return;
    handleEdit(selectedCategory.id, data);
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    editForm.reset();
  });

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    editForm.setValue('name', category.name);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedCategory) return;
    handleDelete(selectedCategory.id);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
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
    handleFilter({
      search: '',
      quantidadeMin: '',
      quantidadeMax: '',
      precoMin: '',
      precoMax: '',
      currentPage: 1,
      itemsPerPage: 10,
      sortField: 'name',
      sortDirection: 'asc'
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Categorias</CardTitle>
            <CardDescription>Gerencie as categorias de produtos</CardDescription>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Nova Categoria</Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre as categorias por nome</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterContainer
            title=""
            description=""
            onReset={resetFilters}
            onApply={() => {}}
          >
            <TextFilter
              value={filterValues.search}
              onChange={(search) => handleFilter({ search })}
              placeholder="Pesquisar por nome..."
              label="Nome"
              description="Digite o nome da categoria"
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
          <CategoryTable
            items={categories}
            filterValues={filterValues}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(id) => {
              const category = categories.find(c => c.id === id);
              if (category) openDeleteModal(category);
            }}
          />

          <Pagination
            currentPage={filterValues.currentPage}
            totalPages={Math.ceil(filteredCategories.length / filterValues.itemsPerPage)}
            itemsPerPage={filterValues.itemsPerPage}
            totalItems={filteredCategories.length}
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
            <DialogTitle>Nova Categoria</DialogTitle>
            <DialogDescription>Crie uma nova categoria.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate} className="space-y-4 py-4">
            <CategoryForm register={createForm.register} />
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
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>Edite a categoria.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4 py-4">
            <CategoryForm register={editForm.register} />
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
              Tem certeza que deseja excluir a categoria "{selectedCategory?.name}"? Esta ação não pode ser desfeita.
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

export default CategoriaPage;