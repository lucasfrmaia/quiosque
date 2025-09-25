'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Category } from '@/types/interfaces/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pagination } from '@/app/_components/Pagination';
import { CategoryTable } from '@/app/_components/categoria/CategoryTable';
import { useCategory } from '@/app/_components/hooks/useCategory';

import { ModalCreateCategory } from '../_components/modals/category/ModalCreateCategory';
import { ModalUpdateCategory } from '../_components/modals/category/ModalEditCategory';
import { ModalDeleteCategory } from '../_components/modals/category/ModalDeleteCategory';
import { CategorySchema } from '@/types/validation';

const CategoriaPage: FC = () => {

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [localSearch, setLocalSearch] = useState('');

  const createForm = useForm<CategorySchema>({ defaultValues: { name: '' } });
  const editForm = useForm<CategorySchema>({ defaultValues: { name: '' } });

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

  useEffect(() => {
    setLocalSearch(queryParams.search || '');
  }, [queryParams.search]);

  const handleSearch = useCallback(() => {
    const newFilters = { ...queryParams, search: localSearch, currentPage: 1 };
    updateUrl(newFilters);
  }, [queryParams, localSearch, updateUrl]);

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

      {/* Search Bar */}
      <Card className="border-green-100 shadow-sm">
        <CardContent className="p-4">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar categorias..."
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
              Buscar Categorias
            </Button>
            <Button onClick={resetFilters} variant="outline" size="sm">
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardContent className="pt-6 space-y-6">
          <CategoryTable
            items={response?.categories || []}
            filterValues={queryParams}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(ctg) => {
              const category = response?.categories?.find(c => c.id === ctg.id);
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