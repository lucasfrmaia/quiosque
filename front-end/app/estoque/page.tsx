'use client';

import { FC, useState } from 'react';
import { ProdutoEstoque, FilterValues } from '@/types/interfaces/entities';
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
import { NumberRangeFilter } from '@/app/_components/filtros/NumberRangeFilter';
import { PageHeader } from '@/app/_components/common/PageHeader';
import { FilterContainer } from '@/app/_components/common/FilterContainer';
import { EstoqueForm } from '@/app/_components/estoque/EstoqueForm';
import { EstoqueTable } from '@/app/_components/estoque/EstoqueTable';
import { useEstoque } from '@/app/_components/hooks/useEstoque';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';

const EstoquePage: FC = () => {
  const {
    estoque,
    produtos,
    filteredEstoque,
    paginatedEstoque,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
    setAppliedFilters,
  } = useEstoque();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProdutoEstoque | null>(null);
  const [formData, setFormData] = useState({
    preco: '',
    quantidade: '',
    dataValidade: '',
    unidade: '',
    produtoId: '',
    estoqueId: '',
    tipo: 'Insumo',
  });

  const handleSubmitCreate = () => {
    handleCreate({
      preco: Number(formData.preco),
      quantidade: Number(formData.quantidade),
      dataValidade: formData.dataValidade,
      unidade: formData.unidade,
      produtoId: Number(formData.produtoId),
      estoqueId: Number(formData.estoqueId),
      tipo: formData.tipo,
    });
    setIsCreateModalOpen(false);
    setFormData({ preco: '', quantidade: '', dataValidade: '', unidade: '', produtoId: '', estoqueId: '', tipo: 'Insumo' });
  };

  const handleSubmitEdit = () => {
    if (!selectedItem) return;
    handleEdit(selectedItem.id, {
      preco: Number(formData.preco),
      quantidade: Number(formData.quantidade),
      dataValidade: formData.dataValidade,
      unidade: formData.unidade,
      produtoId: Number(formData.produtoId),
      estoqueId: Number(formData.estoqueId),
      tipo: formData.tipo,
    });
    setIsEditModalOpen(false);
    setSelectedItem(null);
    setFormData({ preco: '', quantidade: '', dataValidade: '', unidade: '', produtoId: '', estoqueId: '', tipo: 'Insumo' });
  };

  const openEditModal = (item: ProdutoEstoque) => {
    setSelectedItem(item);
    setFormData({
      preco: item.preco.toString(),
      quantidade: item.quantidade.toString(),
      dataValidade: item.dataValidade,
      unidade: item.unidade,
      produtoId: item.produtoId.toString(),
      estoqueId: item.estoqueId.toString(),
      tipo: item.tipo,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (item: ProdutoEstoque) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    handleDelete(selectedItem.id);
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const getActiveFilters = () => {
    const active = [];
    if (filterValues.search) {
      active.push({ label: 'Nome', value: filterValues.search });
    }
    if (filterValues.quantidadeMin) {
      active.push({ label: 'Quantidade Mínima', value: filterValues.quantidadeMin });
    }
    if (filterValues.quantidadeMax) {
      active.push({ label: 'Quantidade Máxima', value: filterValues.quantidadeMax });
    }
    if (filterValues.precoMin) {
      active.push({ label: 'Preço Mínimo', value: `R$ ${filterValues.precoMin}` });
    }
    if (filterValues.precoMax) {
      active.push({ label: 'Preço Máximo', value: `R$ ${filterValues.precoMax}` });
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
      case 'Quantidade Mínima':
        handleFilter({ quantidadeMin: '' });
        break;
      case 'Quantidade Máxima':
        handleFilter({ quantidadeMax: '' });
        break;
      case 'Preço Mínimo':
        handleFilter({ precoMin: '' });
        break;
      case 'Preço Máximo':
        handleFilter({ precoMax: '' });
        break;
    }
  };

  const resetFilters = () => {
    const resetFilters: FilterValues = {
      search: '',
      quantidadeMin: '',
      quantidadeMax: '',
      precoMin: '',
      precoMax: '',
      currentPage: 1,
      itemsPerPage: 10,
      sortField: 'nome',
      sortDirection: 'asc'
    };
    setAppliedFilters(resetFilters);
    handleFilter(resetFilters);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Estoque</CardTitle>
            <CardDescription>Gerencie os itens do seu estoque</CardDescription>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Novo Item</Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os itens do estoque por nome, quantidade ou preço</CardDescription>
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
              placeholder="Pesquisar itens..."
              label="Busca por Nome"
              description="Digite o nome do produto que deseja encontrar"
            />
            <NumberRangeFilter
              minValue={filterValues.quantidadeMin}
              maxValue={filterValues.quantidadeMax}
              onMinChange={(quantidadeMin) => handleFilter({ quantidadeMin })}
              onMaxChange={(quantidadeMax) => handleFilter({ quantidadeMax })}
              minPlaceholder="Quantidade mínima"
              maxPlaceholder="Quantidade máxima"
              label="Quantidade em Estoque"
              description="Filtre por faixa de quantidade disponível"
            />
            <NumberRangeFilter
              minValue={filterValues.precoMin}
              maxValue={filterValues.precoMax}
              onMinChange={(precoMin) => handleFilter({ precoMin })}
              onMaxChange={(precoMax) => handleFilter({ precoMax })}
              minPlaceholder="Preço mínimo"
              maxPlaceholder="Preço máximo"
              label="Faixa de Preço"
              description="Filtre por faixa de preço dos itens"
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
        <CardContent className="pt-6">
          <EstoqueTable
            items={paginatedEstoque}
            filterValues={filterValues}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(id) => {
              const item = paginatedEstoque.find(i => i.id === id);
              if (item) openDeleteModal(item);
            }}
          />

          <div className="mt-6">
            <Pagination
              currentPage={filterValues.currentPage}
              totalPages={Math.ceil(filteredEstoque.length / filterValues.itemsPerPage)}
              itemsPerPage={filterValues.itemsPerPage}
              totalItems={filteredEstoque.length}
              startIndex={(filterValues.currentPage - 1) * filterValues.itemsPerPage}
              onPageChange={(page) => handleFilter({ currentPage: page })}
              onItemsPerPageChange={(itemsPerPage) => handleFilter({ itemsPerPage, currentPage: 1 })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo Item de Estoque</DialogTitle>
            <DialogDescription>Crie um novo item de estoque.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <EstoqueForm 
              formData={formData} 
              onChange={setFormData} 
              produtos={produtos}
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
            <DialogTitle>Editar Item de Estoque</DialogTitle>
            <DialogDescription>Edite o item de estoque.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <EstoqueForm 
              formData={formData} 
              onChange={setFormData} 
              produtos={produtos}
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
              Tem certeza que deseja excluir o item "{selectedItem?.produto?.nome}"? Esta ação não pode ser desfeita.
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

export default EstoquePage;