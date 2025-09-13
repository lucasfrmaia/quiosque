'use client';

import { FC, useState, useEffect } from 'react';
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
import { ProdutoForm } from '@/app/_components/produto/ProdutoForm';
import { useProduto } from '@/app/_components/hooks/useProduto';
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
    setAppliedFilters,
  } = useProduto();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [formData, setFormData] = useState({ nome: '', categoriaId: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/produto/findAllCategories'); // Assume an API endpoint for categories
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmitCreate = () => {
    handleCreate({
      nome: formData.nome,
      categoriaId: Number(formData.categoriaId),
    });
    setIsCreateModalOpen(false);
    setFormData({ nome: '', categoriaId: '' });
  };

  const handleSubmitEdit = () => {
    if (!selectedProduto) return;
    handleEdit(selectedProduto.id, {
      nome: formData.nome,
      categoriaId: Number(formData.categoriaId),
    });
    setIsEditModalOpen(false);
    setSelectedProduto(null);
    setFormData({ nome: '', categoriaId: '' });
  };

  const openEditModal = (produto: Produto) => {
    setSelectedProduto(produto);
    setFormData({
      nome: produto.nome,
      categoriaId: produto.categoriaId?.toString() || '',
    });
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
    const resetFilters = {
      search: '',
      quantidadeMin: '',
      quantidadeMax: '',
      precoMin: '',
      precoMax: '',
      currentPage: 1,
      itemsPerPage: 10,
      sortField: 'nome',
      sortDirection: 'asc' as const,
    };
    setAppliedFilters(resetFilters);
    handleFilter(resetFilters);
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
            onApply={() => setAppliedFilters(filterValues)}
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
          <div className="space-y-4 py-4">
            <ProdutoForm 
              formData={formData} 
              onChange={setFormData} 
              categories={categories}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitCreate}>Criar</Button>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
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
          <div className="space-y-4 py-4">
            <ProdutoForm 
              formData={formData} 
              onChange={setFormData} 
              categories={categories}
              editing={true}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitEdit}>Salvar</Button>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
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