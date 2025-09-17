'use client';

import { FC, useState, useEffect } from 'react';
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

const ProdutoPage: FC = () => {
  const {
    produtos,
    filteredProdutos,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
  } = useProduto();

  const { categories } = useCategory();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
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
      sortField: 'nome',
      sortDirection: 'asc'
    });
  };

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
          >
            <TextFilter
              value={filterValues.search}
              onChange={(search) => handleFilter({ search })}
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
            items={produtos}
            filterValues={filterValues}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(id) => {
              const produto = produtos.find(p => p.id === id);
              if (produto) openDeleteModal(produto);
            }}
          />

          <Pagination
            currentPage={filterValues.currentPage}
            totalPages={Math.ceil(filteredProdutos.length / filterValues.itemsPerPage)}
            itemsPerPage={filterValues.itemsPerPage}
            totalItems={filteredProdutos.length}
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
            <DialogTitle>Novo Produto</DialogTitle>
            <DialogDescription>Crie um novo produto.</DialogDescription>
          </DialogHeader>
          <FormProvider {...createForm}>
            <form onSubmit={handleSubmitCreate} className="space-y-4 py-4">
              <ProdutoForm categories={categories} />
            </form>
          </FormProvider>
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
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>Edite o produto.</DialogDescription>
          </DialogHeader>
          <FormProvider {...editForm}>
            <form onSubmit={handleSubmitEdit} className="space-y-4 py-4">
              <ProdutoForm categories={categories} editing={true} />
            </form>
          </FormProvider>
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
              Tem certeza que deseja excluir o produto "{selectedProduto?.nome}"? Esta ação não pode ser desfeita.
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

export default ProdutoPage;