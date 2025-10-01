'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FilterValues, NotaFiscalVenda } from '@/types/interfaces/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Search, X, Filter } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Pagination } from '@/app/_components/Pagination';
import { NotaFiscalVendaTable } from '@/app/_components/nota-fiscal-venda/NotaFiscalVendaTable';
import { useNotasFiscaisVendas } from '@/app/_components/hooks/useNotasFiscalVendas';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';
import { DateRangeFilter } from '@/app/_components/filtros/DateRangeFilter';
import { NumberRangeFilter } from '@/app/_components/filtros/NumberRangeFilter';

import { ModalCreateNotaVenda } from '../_components/modals/nota-vendas/ModalCreateNotaVenda';
import { ModalEditNotaVenda } from '../_components/modals/nota-vendas/ModalEditNotaVenda';
import { ModalDeleteNotaVenda } from '../_components/modals/nota-vendas/ModalDeleteNotaVenda';
import { NotaFiscalVendaSchema } from '@/types/validation';

const NotasVendasPage: FC = () => {

  const {
    queryParams,
    handlePageChange,
    handleItemsPerPageChange,
    handleCreate,
    handleDelete,
    handleEdit,
    resetFilters,
    updateUrl,
    getNotasByParams,
    handleSort,
    getActiveFilters,
    handleRemoveFilter
  } = useNotasFiscaisVendas();

  const { data: response, isLoading, error } = getNotasByParams();

  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(queryParams);
  const [localSearch, setLocalSearch] = useState(appliedFilters.search || '');

  useEffect(() => {
    setLocalSearch(appliedFilters.search || '');
  }, [appliedFilters.search]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<NotaFiscalVenda | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    dateStart: '',
    dateEnd: '',
    totalMin: '0',
    totalMax: '10000',
  });

  useEffect(() => {
    setFilterValues({
      dateStart: appliedFilters.dateStart || '',
      dateEnd: appliedFilters.dateEnd || '',
      totalMin: appliedFilters.totalMin || '0',
      totalMax: appliedFilters.totalMax || '10000',
    });
  }, [appliedFilters.dateStart, appliedFilters.dateEnd, appliedFilters.totalMin, appliedFilters.totalMax]);

  const createForm = useForm<NotaFiscalVendaSchema>({
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
      produtos: [],
    },
  });
  const editForm = useForm<NotaFiscalVendaSchema>({
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
      produtos: [],
    },
  });

  const handleSearch = useCallback(() => {
    const newFilters = { ...appliedFilters, search: localSearch, currentPage: 1 };
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
  }, [appliedFilters, localSearch, updateUrl]);

  const handleApplyFilters = () => {
    const newFilters = {
      ...appliedFilters,
      dateStart: filterValues.dateStart,
      dateEnd: filterValues.dateEnd,
      totalMin: filterValues.totalMin,
      totalMax: filterValues.totalMax,
      currentPage: 1,
    };
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilterValues({
      dateStart: '',
      dateEnd: '',
      totalMin: '0',
      totalMax: '10000',
    });
    const newFilters = { ...appliedFilters, dateStart: '', dateEnd: '', totalMin: '', totalMax: '', currentPage: 1 };
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleSubmitCreate = createForm.handleSubmit((data) => {
    handleCreate({
      data: new Date(data.data),
      total: Number(data.total),
      produtos: data.produtos.map((p) => ({
        produtoId: Number(p.produtoId),
        quantidade: Number(p.quantidade),
        unidade: p.unidade,
        precoUnitario: Number(p.precoUnitario),
      })),
    });
    setIsCreateModalOpen(false);
    createForm.reset();
  });

  const handleSubmitEdit = editForm.handleSubmit((data) => {
    if (!selectedNota) return;
    handleEdit(selectedNota.id, {
      data: new Date(data.data),
      total: Number(data.total),
    });
    setIsEditModalOpen(false);
    setSelectedNota(null);
    editForm.reset();
  });

  const openEditModal = (nota: NotaFiscalVenda) => {
    setSelectedNota(nota);
    editForm.setValue('data', nota.data.toLocaleString());
    editForm.setValue('total', nota.total)
    editForm.setValue(
      'produtos',
      nota.produtos?.map((p) => ({
        produtoId: p.produtoId,
        quantidade: p.quantidade,
        unidade: p.unidade,
        precoUnitario: p.precoUnitario,
      })) || []
    );
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (nota: NotaFiscalVenda) => {
    setSelectedNota(nota);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedNota) return;
    handleDelete(selectedNota.id);
    setIsDeleteModalOpen(false);
    setSelectedNota(null);
  };

  if (isLoading) return <>Carregando...</>;
  if (error) return <>Error</>

  const activeFilters = getActiveFilters();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-green-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Notas Fiscais de Venda</h1>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Adicionar Nota Fiscal de Venda
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mx-auto max-w-4xl mb-6">
        <div className="relative flex items-center justify-center gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar notas por ID, total ou data..."
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
                  const newFilters = { ...appliedFilters, search: '', currentPage: 1 };
                  setAppliedFilters(newFilters);
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
            onClick={() => setIsFilterOpen(true)}
            className="rounded-xl border-2 border-green-300 hover:bg-green-50 hover:border-green-500 flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="rounded-xl border-2 border-green-300 hover:bg-green-50 hover:border-green-500 flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-200"
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters
        filters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearFilters}
      />

      {/* Filters Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Filtros</DialogTitle>
            <DialogDescription>Ajuste os filtros para encontrar as notas ideais.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Date Range Filter */}
            <DateRangeFilter
              startDate={filterValues.dateStart}
              endDate={filterValues.dateEnd}
              onStartDateChange={(value) => setFilterValues({ ...filterValues, dateStart: value })}
              onEndDateChange={(value) => setFilterValues({ ...filterValues, dateEnd: value })}
              label="Período"
              description="Selecione o intervalo de datas das notas fiscais"
            />

            {/* Total Range Slider */}
            <div className="space-y-2">
              <Label>Faixa de Total (R$)</Label>
              <Slider
                value={[Number(filterValues.totalMin), Number(filterValues.totalMax)]}
                onValueChange={(value) =>
                  setFilterValues({
                    ...filterValues,
                    totalMin: value[0].toString(),
                    totalMax: value[1].toString(),
                  })
                }
                max={10000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>R$ {Number(filterValues.totalMin).toFixed(0)}</span>
                <span>R$ {Number(filterValues.totalMax).toFixed(0)}</span>
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
        <CardContent className="pt-6 space-y-6">
          <NotaFiscalVendaTable
            items={response?.notas || []}
            filterValues={appliedFilters}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(notaSelected) => {
              const nota = response?.notas?.find((n) => n.id === notaSelected.id);
              if (nota) openDeleteModal(nota);
            }}
          />

          <Pagination
            currentPage={appliedFilters.currentPage}
            totalPages={Math.ceil((response?.total || 0) / appliedFilters.itemsPerPage)}
            itemsPerPage={appliedFilters.itemsPerPage}
            totalItems={response?.total || 0}
            startIndex={(appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <ModalCreateNotaVenda
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        createForm={createForm}
        handleSubmitCreate={handleSubmitCreate}
      />

      {/* Edit Dialog */}
      <ModalEditNotaVenda
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editForm={editForm}
        handleSubmitEdit={handleSubmitEdit}
      />

      {/* Delete Dialog */}
      <ModalDeleteNotaVenda
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        selectedNota={selectedNota}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default NotasVendasPage;
