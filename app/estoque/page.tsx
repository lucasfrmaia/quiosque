'use client';

import { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ProdutoEstoque, SortDirection } from '@/types/interfaces/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Pagination } from '@/app/_components/Pagination';
import { EstoqueTable } from '@/app/_components/tables/EstoqueTable';
import { useEstoque } from '@/app/_components/hooks/useEstoque';
import { useCategory } from '@/app/_components/hooks/useCategory';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';
import { ModalEstoqueCreate } from '../_components/modals/estoque/ModalEstoqueCreate';
import { ModalEditEstoque } from '../_components/modals/estoque/ModalEditEstoque';
import { ModalDeleteEstoque } from '../_components/modals/estoque/ModalDeleteEstoque';
import { useProduto } from '../_components/hooks/useProduto';
import { Filter, Package, Plus, Search, X } from 'lucide-react';
import { EstoqueSchema, produtoEstoqueSchema } from '@/types/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import TableSkeleton from '../_components/skeletons/TableSkeleton';

const EstoquePage: FC = () => {
  const {
    queryParams: appliedFilters,
    handleCreate,
    handleEdit,
    handleDelete,
    resetFilters,
    handlePageChange,
    handleItemsPerPageChange,
    handleRemoveFilter,
    updateUrl,
    getActiveFilters,
  } = useEstoque();

  const { getAllCategories } = useCategory();
  const { data: categories = [] } = getAllCategories();

  const { getAllProdutos } = useProduto();
  const {
    data: produtos = [],
    isLoading: isLoadingProduto,
    error: errorProduto,
  } = getAllProdutos();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProdutoEstoque | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    categoryId: null as string | null,
    precoMin: '0',
    precoMax: '1000',
  });

  const [searchInput, setSearchInput] = useState(appliedFilters.search || '');
  const { estoqueQuery: { data: response, isLoading, error } = {} } = useEstoque();

  useEffect(() => {
    setFilterValues({
      categoryId: appliedFilters.categoryId || null,
      precoMin: appliedFilters.precoMin || '0',
      precoMax: appliedFilters.precoMax || '1000',
    });
  }, [appliedFilters.categoryId, appliedFilters.precoMin, appliedFilters.precoMax]);

  useEffect(() => {
    setSearchInput(appliedFilters.search || '');
  }, [appliedFilters.search]);

  const handleApplyFilters = () => {
    const newFilters = {
      ...appliedFilters,
      categoryId: filterValues.categoryId,
      precoMin: filterValues.precoMin,
      precoMax: filterValues.precoMax,
      currentPage: 1,
    };
    updateUrl(newFilters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilterValues({
      categoryId: null,
      precoMin: '0',
      precoMax: '1000',
    });
    resetFilters();
  };

  const createForm = useForm<EstoqueSchema>({
    resolver: zodResolver(produtoEstoqueSchema),
    defaultValues: {
      preco: 0,
      quantidade: 0,
      dataValidade: undefined,
      produtoId: undefined,
    },
  });

  const editForm = useForm<EstoqueSchema>({
    resolver: zodResolver(produtoEstoqueSchema),
    defaultValues: {
      preco: 0,
      quantidade: 0,
      dataValidade: undefined,
      produtoId: undefined,
    },
  });

  const handleSubmitCreate = createForm.handleSubmit((data) => {
    handleCreate({
      preco: data.preco,
      quantidade: data.quantidade,
      dataValidade: data.dataValidade || null,
      produtoId: data.produtoId,
      estocavel: data.estocavel,
    });
    setIsCreateModalOpen(false);
    createForm.reset();
  });

  const handleSubmitEdit = editForm.handleSubmit((data) => {
    if (!selectedItem) return;
    handleEdit(selectedItem.id, {
      preco: data.preco,
      quantidade: data.quantidade,
      dataValidade: data.dataValidade,
      produtoId: data.produtoId,
      estocavel: data.estocavel,
    });
    setIsEditModalOpen(false);
    setSelectedItem(null);
    editForm.reset();
  });

  const openEditModal = (item: ProdutoEstoque) => {
    setSelectedItem(item);
    editForm.setValue('preco', item.preco);
    editForm.setValue('quantidade', item.quantidade);
    editForm.setValue('dataValidade', item.dataValidade ?? undefined);
    editForm.setValue('produtoId', item.produtoId);
    editForm.setValue('estocavel', item.estocavel);
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

  if (isLoading || isLoadingProduto) return <TableSkeleton />;
  if (error || errorProduto) return <p>Erro ao carregar estoque!</p>;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-green-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Estoque</h1>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Adicionar Item de Estoque
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mx-auto max-w-4xl mb-6">
        <div className="relative flex items-center justify-center gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar itens de estoque por nome ou categoria..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 shadow-sm hover:border-green-300 transition-all duration-200"
            />
            {searchInput && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => {
                  setSearchInput('');
                  updateUrl({ ...appliedFilters, search: '', currentPage: 1 });
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-9 px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => {
                updateUrl({ ...appliedFilters, search: searchInput, currentPage: 1 });
              }}
            >
              <Search className="h-4 w-4 mr-1" />
              Buscar
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="rounded-xl border-2 border-green-300 hover:bg-green-50 hover:border-green-500 flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      <ActiveFilters
        filters={getActiveFilters()}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={resetFilters}
      />

      {/* Filters Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Filtros</DialogTitle>
            <DialogDescription>
              Ajuste os filtros para encontrar os produtos ideais.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterValues.categoryId === null ? 'default' : 'outline'}
                  className={`rounded-full ${
                    filterValues.categoryId === null
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'border-green-300 hover:bg-green-50'
                  }`}
                  onClick={() => setFilterValues({ ...filterValues, categoryId: null })}
                >
                  Todas
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      filterValues.categoryId === String(category.id) ? 'default' : 'outline'
                    }
                    className={`rounded-full ${
                      filterValues.categoryId === String(category.id)
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'border-green-300 hover:bg-green-50'
                    }`}
                    onClick={() =>
                      setFilterValues({ ...filterValues, categoryId: String(category.id) })
                    }
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2">
              <Label>Faixa de Preço (R$)</Label>
              <Slider
                value={[Number(filterValues.precoMin), Number(filterValues.precoMax)]}
                onValueChange={(value) =>
                  setFilterValues({
                    ...filterValues,
                    precoMin: value[0].toString(),
                    precoMax: value[1].toString(),
                  })
                }
                max={1000}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>R$ {Number(filterValues.precoMin).toFixed(0)}</span>
                <span>R$ {Number(filterValues.precoMax).toFixed(0)}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={handleApplyFilters} className="bg-green-500 hover:bg-green-600">
              Aplicar
            </Button>
            <Button variant="outline" onClick={() => setIsFilterOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="pt-6">
          <EstoqueTable
            items={response?.estoque || []}
            filterValues={appliedFilters}
            onEdit={openEditModal}
            onDelete={(produtoEstoque) => {
              const item = response?.estoque.find(
                (i: ProdutoEstoque) => i.id === produtoEstoque.id,
              );
              if (item) openDeleteModal(item);
            }}
          />

          <div className="mt-6">
            <Pagination
              currentPage={appliedFilters.currentPage}
              totalPages={Math.ceil((response?.total || 0) / appliedFilters.itemsPerPage)}
              itemsPerPage={appliedFilters.itemsPerPage}
              totalItems={response?.total || 0}
              startIndex={(appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <ModalEstoqueCreate
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        onSubmit={handleSubmitCreate}
        createForm={createForm}
        produtos={produtos || []}
      />

      {/* Edit Dialog */}
      <ModalEditEstoque
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        onSubmit={handleSubmitEdit}
        editForm={editForm}
        produtos={produtos || []}
      />

      {/* Delete Dialog */}
      <ModalDeleteEstoque
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        selectedItem={selectedItem}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default EstoquePage;
