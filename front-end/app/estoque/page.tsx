'use client';

import { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ProdutoEstoque, SortDirection } from '@/types/interfaces/entities';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Pagination } from '@/app/_components/Pagination';
import { EstoqueForm, EstoqueFormData } from '@/app/_components/estoque/EstoqueForm';
import { EstoqueTable } from '@/app/_components/estoque/EstoqueTable';
import { useEstoque } from '@/app/_components/hooks/useEstoque';
import { useCategory } from '@/app/_components/hooks/useCategory';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';
import { ModalEstoqueCreate } from '../_components/modals/estoque/ModalEstoqueCreate';
import { ModalEditEstoque } from '../_components/modals/estoque/ModalEditEstoque';
import { ModalDeleteEstoque } from '../_components/modals/estoque/ModalDeleteEstoque';
import { useProduto } from '../_components/hooks/useProduto';
import { Filter, ChevronDown, Search, X } from 'lucide-react';

const EstoquePage: FC = () => {
  const {
    queryParams: appliedFilters,
    handleCreate,
    handleEdit,
    handleDelete,
    resetFilters,
    handleApply,
    handlePageChange,
    handleItemsPerPageChange,
    handleRemoveFilter,
    updateUrl,
    getActiveFilters,
    handleSort
  } = useEstoque();
  
  const { getAllCategories } = useCategory();
  const { data: categories = [] } = getAllCategories();
  
  const { allProdutosQuery: { data: produtos = [], isLoading: isLoadingProduto, error: errorProduto } = {} } = useProduto()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProdutoEstoque | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    categoryId: null as number | null,
    precoMin: '0',
    precoMax: '1000',
    sortOption: 'default' as 'default' | 'asc' | 'desc',
  });

  const { estoqueQuery: { data: response, isLoading, error } = {} } = useEstoque();

  useEffect(() => {
    setFilterValues({
      categoryId: appliedFilters.categoryId || null,
      precoMin: appliedFilters.precoMin || '0',
      precoMax: appliedFilters.precoMax || '1000',
      sortOption: appliedFilters.sortField ? (appliedFilters.sortDirection === 'asc' ? 'asc' : 'desc') : 'default',
    });
  }, [appliedFilters.categoryId, appliedFilters.precoMin, appliedFilters.precoMax, appliedFilters.sortField, appliedFilters.sortDirection]);

  const handleApplyFilters = () => {
    const newFilters = {
      ...appliedFilters,
      categoryId: filterValues.categoryId,
      precoMin: filterValues.precoMin,
      precoMax: filterValues.precoMax,
      sortField: filterValues.sortOption === 'default' ? undefined : 'preco',
      sortDirection: filterValues.sortOption === 'default' ? undefined : (filterValues.sortOption as SortDirection),
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
      sortOption: 'default',
    });
    resetFilters();
  };

  const createForm = useForm<EstoqueFormData>({
    defaultValues: {
      preco: '',
      quantidade: '',
      dataValidade: '',
      unidade: '',
      produtoId: '',
    },
  });

  const editForm = useForm<EstoqueFormData>({
    defaultValues: {
      preco: '',
      quantidade: '',
      dataValidade: '',
      unidade: '',
      produtoId: '',
    },
  });

  const handleSubmitCreate = createForm.handleSubmit((data) => {
    handleCreate({
      preco: Number(data.preco),
      quantidade: Number(data.quantidade),
      dataValidade: data.dataValidade,
      unidade: data.unidade,
      produtoId: Number(data.produtoId),
    });
    setIsCreateModalOpen(false);
    createForm.reset();
  });

  const handleSubmitEdit = editForm.handleSubmit((data) => {
    if (!selectedItem) return;
    handleEdit(selectedItem.id, {
      preco: Number(data.preco),
      quantidade: Number(data.quantidade),
      dataValidade: data.dataValidade,
      unidade: data.unidade,
      produtoId: Number(data.produtoId),
    });
    setIsEditModalOpen(false);
    setSelectedItem(null);
    editForm.reset();
  });

  const openEditModal = (item: ProdutoEstoque) => {
    setSelectedItem(item);
    editForm.setValue('preco', item.preco.toString());
    editForm.setValue('quantidade', item.quantidade.toString());
    editForm.setValue('dataValidade', item.dataValidade || '');
    editForm.setValue('unidade', item.unidade);
    editForm.setValue('produtoId', item.produtoId.toString());
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

  if (isLoading || isLoadingProduto) return <p>Carregando...</p>;
  if (error || errorProduto) return <p>Erro ao carregar estoque!</p>;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Estoque</CardTitle>
            <CardDescription>Gerencie os itens do seu estoque</CardDescription>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-green-500 hover:bg-green-600">Novo Item</Button>
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
                onChange={(e) => updateUrl({ ...appliedFilters, search: e.target.value, currentPage: 1 })}
                className="pl-10 pr-4 rounded-xl border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 shadow-md transition-all duration-200 hover:shadow-lg"
              />
              {appliedFilters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => updateUrl({ ...appliedFilters, search: '', currentPage: 1 })}
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
            <DialogDescription>Ajuste os filtros para encontrar os produtos ideais.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterValues.categoryId === null ? "default" : "outline"}
                  className={`rounded-full ${filterValues.categoryId === null ? 'bg-green-500 text-white hover:bg-green-600' : 'border-green-300 hover:bg-green-50'}`}
                  onClick={() => setFilterValues({ ...filterValues, categoryId: null })}
                >
                  Todas
                </Button>
                {categories.map((category) => (
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

            {/* Sort Select */}
            <div className="space-y-2">
              <Label>Ordenar por</Label>
              <Select value={filterValues.sortOption} onValueChange={(value) => setFilterValues({ ...filterValues, sortOption: value as 'default' | 'asc' | 'desc' })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Padrão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão</SelectItem>
                  <SelectItem value="asc">Preço: Menor para Maior</SelectItem>
                  <SelectItem value="desc">Preço: Maior para Menor</SelectItem>
                </SelectContent>
              </Select>
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
            onSort={() => {}}
            onEdit={openEditModal}
            onDelete={(id) => {
              const item = response?.estoque.find((i: ProdutoEstoque) => i.id === id);
              if (item) openDeleteModal(item);
            }}
          />

          <div className="mt-6">
            <Pagination
              currentPage={appliedFilters.currentPage}
              totalPages={Math.ceil((response?.total || 0) / appliedFilters.itemsPerPage)}
              itemsPerPage={appliedFilters.itemsPerPage}
              totalItems={response?.total || 0}
              startIndex={
                (appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage
              }
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
        handleSubmitCreate={handleSubmitCreate}
        createForm={createForm}
        produtos={produtos || []}
      />

      {/* Edit Dialog */}
      <ModalEditEstoque
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        handleSubmitEdit={handleSubmitEdit}
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
