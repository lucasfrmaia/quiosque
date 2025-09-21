'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterValues, SortDirection } from '@/types/interfaces/entities';
import { useForm, FormProvider } from 'react-hook-form';
import { Produto } from '@/types/interfaces/entities';
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
import { ProdutoTable } from '@/app/_components/produto/ProdutoTable';
import { ProdutoForm, ProdutoFormData } from '@/app/_components/produto/ProdutoForm';
import { useProduto } from '@/app/_components/hooks/useProduto';

import { useCategory } from '@/app/_components/hooks/useCategory';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';
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

  const { data, isLoading, error } = getProdutosByParams()
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

  console.log(data?.produtos, data?.total, error, isLoading)

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

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os produtos por nome</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterContainer
            title=""
            description=""
            onReset={resetFilters}
            onApply={handleApply}
          >
            <TextFilter
              value={appliedFilters.search || ""}
              onChange={(search) => {
                const newFilters = { ...appliedFilters, search, currentPage: 1 };
                updateUrl(newFilters);
              }}
              placeholder="Pesquisar por nome..."
              label="Nome"
              description="Digite o nome do produto"
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