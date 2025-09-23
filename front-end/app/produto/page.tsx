'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterValues, SortDirection } from '@/types/interfaces/entities';
import { useForm, FormProvider } from 'react-hook-form';
import { Produto } from '@/types/interfaces/entities';
import { Category } from '@/types/interfaces/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { ProdutoTable } from '@/app/_components/produto/ProdutoTable';
import { ProdutoForm, ProdutoFormData } from '@/app/_components/produto/ProdutoForm';
import { useProduto } from '@/app/_components/hooks/useProduto';

import { useCategory } from '@/app/_components/hooks/useCategory';
import { Filter, Search, X } from 'lucide-react';
import { ModalCreateProduct } from '../_components/modals/product/ModalCreateProdutct';
import { ModalUpdateProduct } from '../_components/modals/product/ModalUpadteProduct';
import { ModalDeleteProduct } from '../_components/modals/product/ModalDeleteProduct';

const ProdutoPage: FC = () => {

  const {
    queryParams: appliedFilters,
    handleCreate,
    handleEdit,
    handleDelete,
    resetFilters,
    handleApply,
    updateUrl,
    getActiveFilters,
    getProdutosByParams,
    handleItemsPerPageChange,
    handlePageChange,
    handleRemoveFilter,
    handleSort
  } = useProduto();
  const { getAllCategories } = useCategory();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    categoryId: undefined as number | undefined,
  });

  const { data, isLoading, error } = getProdutosByParams()

  useEffect(() => {
    setFilterValues({
      categoryId: appliedFilters.categoryId ?? undefined,
    });
  }, [appliedFilters.categoryId]);
  const { data: categories, isLoading: isLoadingCategories, error: erroCategories } = getAllCategories()

  const createForm = useForm<ProdutoFormData>({
    defaultValues: { nome: '', categoriaId: '', ativo: 'true', tipo: 'INSUMO', descricao: '', imagemUrl: '' }
  });
  const editForm = useForm<ProdutoFormData>({
    defaultValues: { nome: '', categoriaId: '', ativo: 'true', tipo: 'INSUMO', descricao: '', imagemUrl: '' }
  });

  const handleSubmitCreate = createForm.handleSubmit((data) => {
    handleCreate({
      nome: data.nome,
      descricao: data.descricao || null,
      imagemUrl: data.imagemUrl || null,
      ativo: data.ativo === 'true',
      tipo: data.tipo,
      categoriaId: Number(data.categoriaId),
    });
    setIsCreateModalOpen(false);
    createForm.reset();
  });

  const handleSubmitEdit = editForm.handleSubmit((data) => {
    if (!selectedProduto) return;
    handleEdit(selectedProduto.id, {
      nome: data.nome,
      descricao: data.descricao || null,
      imagemUrl: data.imagemUrl || null,
      ativo: data.ativo === 'true',
      tipo: data.tipo,
      categoriaId: Number(data.categoriaId),
    });
    setIsEditModalOpen(false);
    setSelectedProduto(null);
    editForm.reset();
  });

  const openEditModal = (produto: Produto) => {
    setSelectedProduto(produto);
    editForm.setValue('nome', produto.nome);
    editForm.setValue('categoriaId', produto.categoriaId?.toString() || '');
    editForm.setValue('ativo', produto.ativo.toString());
    editForm.setValue('tipo', produto.tipo);
    editForm.setValue('descricao', produto.descricao || '');
    editForm.setValue('imagemUrl', produto.imagemUrl || '');
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (produto: Produto) => {
    setSelectedProduto(produto);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedProduto) return;
    handleDelete(selectedProduto.id);
    setIsDeleteModalOpen(false);
    setSelectedProduto(null);
  };

  const handleApplyFilters = () => {
    const newFilters = {
      ...appliedFilters,
      categoryId: filterValues.categoryId,
      currentPage: 1,
    };
    updateUrl(newFilters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilterValues({
      categoryId: undefined,
    });
    const newFilters = { ...appliedFilters, categoryId: undefined, currentPage: 1 };
    updateUrl(newFilters);
  };

  if (isLoading || isLoadingCategories) return <p>Carregando...</p>;
  if (error || erroCategories) return <p>Error!</p>;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Produtos</CardTitle>
            <CardDescription>Gerencie os produtos do sistema</CardDescription>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Novo Produto</Button>
        </CardHeader>
      </Card>

      {/* Search Bar */}
      <Card className="border-green-100 shadow-sm">
        <CardContent className="p-4">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar produtos..."
                value={appliedFilters.search || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newFilters = { ...appliedFilters, search: e.target.value, currentPage: 1, categoryId: appliedFilters.categoryId ?? undefined };
                  updateUrl(newFilters);
                }}
                className="pl-10 pr-4 rounded-xl border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 shadow-md transition-all duration-200 hover:shadow-lg"
              />
              {appliedFilters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => {
                    const newFilters = { ...appliedFilters, search: '', currentPage: 1, categoryId: appliedFilters.categoryId ?? undefined };
                    updateUrl(newFilters);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(true)}
              className="rounded-xl border-green-300 hover:bg-green-50 hover:border-green-400 flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Filtros</DialogTitle>
            <DialogDescription>Ajuste os filtros para encontrar os produtos ideais.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterValues.categoryId === undefined ? "default" : "outline"}
                  className={`rounded-full ${filterValues.categoryId === undefined ? 'bg-green-500 text-white hover:bg-green-600' : 'border-green-300 hover:bg-green-50'}`}
                  onClick={() => setFilterValues({ ...filterValues, categoryId: undefined })}
                >
                  Todas
                </Button>
                {categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={filterValues.categoryId === category.id ? "default" : "outline"}
                    className={`rounded-full ${filterValues.categoryId === category.id ? 'bg-green-500 text-white hover:bg-green-600' : 'border-green-300 hover:bg-green-50'}`}
                    onClick={() => setFilterValues({ ...filterValues, categoryId: category.id })}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={handleApplyFilters} className="bg-green-500 hover:bg-green-600">
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={() => setIsFilterOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <ProdutoTable
            items={data?.produtos || []}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(id) => {
              const produto = data?.produtos.find(p => p.id === id);
              if (produto) openDeleteModal(produto);
            }}
          />

          <Pagination
            currentPage={appliedFilters.currentPage}
            totalPages={Math.ceil((data?.total || 0) / appliedFilters.itemsPerPage)}
            itemsPerPage={appliedFilters.itemsPerPage}
            totalItems={data?.total || 0}
            startIndex={(appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <ModalCreateProduct
        isCreateModalOpen={isCreateModalOpen}
        createForm={createForm}
        categories={categories || []}
        setIsCreateModalOpen={setIsCreateModalOpen}
        handleSubmitCreate={handleSubmitCreate}
      />

      <ModalUpdateProduct
        isEditModalOpen={isEditModalOpen}
        editForm={editForm}
        categories={categories || []}
        setIsEditModalOpen={setIsEditModalOpen}
        handleSubmitEdit={handleSubmitEdit}
      />

      {/* Delete Dialog */}
      <ModalDeleteProduct
        isDeleteModalOpen={isDeleteModalOpen}
        selectedProduto={selectedProduto}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleDeleteConfirm={handleDeleteConfirm}
      />


    </div>
  );
};

export default ProdutoPage;