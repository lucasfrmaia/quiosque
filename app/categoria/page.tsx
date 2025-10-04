'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category } from '@/types/interfaces/entities';
import { CategorySchema, categorySchema } from '@/types/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Tag, Plus, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/app/_components/Pagination';
import { CategoryTable } from '@/app/_components/tables/CategoryTable';
import { useCategory } from '@/app/_components/hooks/useCategory';

import { ModalCreateCategory } from '../_components/modals/category/ModalCreateCategory';
import { ModalUpdateCategory } from '../_components/modals/category/ModalEditCategory';
import { ModalDeleteCategory } from '../_components/modals/category/ModalDeleteCategory';
import TableSkeleton from '../_components/skeletons/TableSkeleton';

const CategoriaPage: FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [localSearch, setLocalSearch] = useState('');

  const createMethods = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });
  const createForm = createMethods;

  const editMethods = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });
  const editForm = editMethods;

  const {
    queryParams,
    categoryParams,
    handlePageChange,
    handleItemsPerPageChange,
    handleCreate,
    handleDelete,
    handleEdit,
    resetFilters,
    updateUrl,
  } = useCategory();

  const { data: response, isLoading } = categoryParams;

  useEffect(() => {
    setLocalSearch(queryParams.search || '');
  }, [queryParams.search]);

  const handleSearch = useCallback(() => {
    const newFilters = { ...queryParams, search: localSearch, currentPage: 1 };
    updateUrl(newFilters);
  }, [queryParams, localSearch, updateUrl]);

  const onSubmitCreate = createForm.handleSubmit((data) => {
    handleCreate(data);
    setIsCreateModalOpen(false);
    createForm.reset();
  });

  const onSubmitEdit = editForm.handleSubmit((data) => {
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

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center">
          <Tag className="h-8 w-8 text-green-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Categorias</h1>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Adicionar Categoria
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mx-auto max-w-4xl mb-6">
        <div className="relative flex items-center justify-center gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar categorias por nome..."
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
                  const newFilters = { ...queryParams, search: '', currentPage: 1 };
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
          <CategoryTable
            items={response?.categories || []}
            filterValues={queryParams}
            onEdit={openEditModal}
            onDelete={(ctg) => {
              const category = response?.categories?.find((c) => c.id === ctg.id);
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
        createForm={createForm}
        onSubmit={onSubmitCreate}
      />

      {/* Edit Dialog */}
      <ModalUpdateCategory
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editForm={editForm}
        onSubmit={onSubmitEdit}
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
