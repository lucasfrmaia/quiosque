'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterValues, SortDirection } from '@/types/interfaces/entities';
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
import { ModalCreateCategory } from '../_components/modals/category/ModalCreateCategory';
import { ModalUpdateCategory } from '../_components/modals/category/ModalEditCategory';
import { ModalDeleteCategory } from '../_components/modals/category/ModalDeleteCategory';
import { useQuery } from '@tanstack/react-query';

const CategoriaPage: FC = () => {

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const createForm = useForm<CategoryFormData>({ defaultValues: { name: '' } });
  const editForm = useForm<CategoryFormData>({ defaultValues: { name: '' } });

  const {
    queryParams,
    handleRemoveFilter,
    handlePageChange,
    handleItemsPerPageChange,
    handleCreate,
    handleDelete,
    handleEdit,
    handleApply,
    resetFilters,
    updateUrl,
    handleSort,
    getActiveFilters,
    getCategoriesByParams
  } = useCategory()

  const { data: response, isLoading } = getCategoriesByParams()

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

  if (isLoading)
    return <>Carregando...</>

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
            onApply={handleApply}
          >
            <TextFilter
              value={queryParams.search || ""}
              onChange={(search) => {
                const newFilters = { ...queryParams, search, currentPage: 1 };
                updateUrl(newFilters);
              }}
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
            items={response?.categories || []}
            filterValues={queryParams}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(id) => {
              const category = response?.categories?.find(c => c.id === id);
              if (category) openDeleteModal(category);
            }}
          />

          <Pagination
            currentPage={queryParams.currentPage}
            totalPages={Math.ceil((response?.total || 0) / queryParams.itemsPerPage)}
            itemsPerPage={queryParams.itemsPerPage}
            totalItems={response?.total || 0}
            startIndex={(queryParams.currentPage - 1) * queryParams.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <ModalCreateCategory
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        handleSubmitCreate={handleSubmitCreate}
        createForm={createForm}
      />

      {/* Edit Dialog */}
      <ModalUpdateCategory
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        handleSubmitEdit={handleSubmitEdit}
        editForm={editForm}
      />

      {/* Delete Dialog */}
      <ModalDeleteCategory
        isDeleteModalOpen={isDeleteModalOpen}
        selectedCategory={selectedCategory}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleDeleteConfirm={handleDeleteConfirm}
      />

    </div>
  );
};

export default CategoriaPage;