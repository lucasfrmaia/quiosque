'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterValues, SortDirection, NotaFiscalCompra } from '@/types/interfaces/entities';
import { useForm } from 'react-hook-form';
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
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Pagination } from '@/app/_components/Pagination';
import { NotaFiscalCompraTable } from '@/app/_components/tables/NotaFiscalCompraTable';
import { useNotaFiscalCompra } from '@/app/_components/hooks/useNotaFiscalCompra';
import { useFornecedor } from '@/app/_components/hooks/useFornecedor';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';
import { DateRangeFilter } from '@/app/_components/filtros/DateRangeFilter';
import { SearchableSelect, Option } from '@/app/_components/common/SearchableSelect';
import { ModalCreateNotaCompra } from '../_components/modals/notas-compras/ModalCreateNotaCompra';
import { ModalEditNotaCompra } from '../_components/modals/notas-compras/ModalEditeNotaCompra';
import { ModalDeleteNotaCompra } from '../_components/modals/notas-compras/ModalDeleteNotaCompra';
import { FileText, Plus, Search, X, Filter, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NotaFiscalCompraSchema, notaFiscalCompraSchema } from '@/types/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import TableSkeleton from '../_components/skeletons/TableSkeleton';

const NotasCompraPage: FC = () => {
  /** Extrai filtros da URL */
  const {
    handleCreate,
    handleEdit,
    handleDelete,
    getNotasFiscaisCompras,
    updateUrl,
    resetFilters,
    queryParams,
    getActiveFilters,
    handleRemoveFilter,
  } = useNotaFiscalCompra();
  const { data: responseNotas, isLoading, error } = getNotasFiscaisCompras();

  const { getAllFornecedores } = useFornecedor();
  const {
    data: responsefornecedores,
    isLoading: isLoadingFornecedor,
    error: errorFornecedor,
  } = getAllFornecedores();

  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({
    ...queryParams,
    search: '',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<NotaFiscalCompra | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    dateStart: '',
    dateEnd: '',
    totalMin: '0',
    totalMax: '0',
    fornecedorId: '',
  });

  useEffect(() => {
    setFilterValues({
      dateStart: appliedFilters.dateStart || '',
      dateEnd: appliedFilters.dateEnd || '',
      totalMin: appliedFilters.totalMin || '0',
      totalMax: appliedFilters.totalMax || '10000',
      fornecedorId: appliedFilters.fornecedorId || '',
    });
  }, [
    appliedFilters.dateStart,
    appliedFilters.dateEnd,
    appliedFilters.totalMin,
    appliedFilters.totalMax,
    appliedFilters.fornecedorId,
  ]);

  const createForm = useForm<NotaFiscalCompraSchema>({
    resolver: zodResolver(notaFiscalCompraSchema),
    defaultValues: {
      data: new Date(),
      fornecedorId: undefined,
      produtos: [],
    },
  });

  const editForm = useForm<NotaFiscalCompraSchema>({
    resolver: zodResolver(notaFiscalCompraSchema),
    defaultValues: {
      data: new Date(),
      fornecedorId: undefined,
      produtos: [],
    },
  });

  const handleApplyFilters = () => {
    const newFilters = {
      ...appliedFilters,
      dateStart: filterValues.dateStart,
      dateEnd: filterValues.dateEnd,
      totalMin: filterValues.totalMin,
      totalMax: filterValues.totalMax,
      fornecedorId: filterValues.fornecedorId,
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
      fornecedorId: '',
    });
    const newFilters = {
      ...appliedFilters,
      dateStart: '',
      dateEnd: '',
      totalMin: '',
      totalMax: '',
      fornecedorId: '',
      search: '',
      currentPage: 1,
    };
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
  };

  /** Atualiza URL com filtros */

  const handlePageChange = (page: number) => {
    const newFilters = { ...appliedFilters, currentPage: page };
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    const newFilters = { ...appliedFilters, itemsPerPage, currentPage: 1 };
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
  };

  /** CRUD */
  const handleSubmitCreate = createForm.handleSubmit((data) => {
    handleCreate({
      data: new Date(data.data),
      fornecedorId: data.fornecedorId,
      total: data.produtos.reduce((acc, value) => acc + value.precoUnitario, 0),
      ativo: data.ativo,
      produtos: data.produtos.map((p) => ({
        produtoId: p.produtoId,
        quantidade: p.quantidade,
        unidade: p.unidade,
        precoUnitario: p.precoUnitario,
      })),
    });
    setIsCreateModalOpen(false);
    createForm.reset();
  });

  const handleSubmitEdit = editForm.handleSubmit((data) => {
    if (!selectedNota) return;
    handleEdit(selectedNota.id, {
      data: new Date(data.data),
      fornecedorId: data.fornecedorId,
    });

    setIsEditModalOpen(false);
    setSelectedNota(null);
    editForm.reset();
  });

  const openEditModal = (nota: NotaFiscalCompra) => {
    setSelectedNota(nota);
    editForm.setValue('data', nota.data);
    editForm.setValue('fornecedorId', nota.fornecedorId);
    editForm.setValue('produtos', nota.produtos || []);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (nota: NotaFiscalCompra) => {
    setSelectedNota(nota);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedNota) return;
    handleDelete(selectedNota.id);
    setIsDeleteModalOpen(false);
    setSelectedNota(null);
  };

  if (isLoading || isLoadingFornecedor) {
    return <TableSkeleton />;
  }

  if (error || errorFornecedor) {
    console.error(error, 'ou', errorFornecedor);
    return <>Error!</>;
  }

  const activeFilters = getActiveFilters();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-green-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciamento de Notas Fiscais de Compra
          </h1>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Adicionar Nota Fiscal de Compra
        </Button>
      </div>

      {/* Filters Buttons */}
      <div className="mx-auto max-w-4xl mb-6 flex justify-center gap-4">
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

      {/* Filtros ativos */}
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
            {/* Fornecedor Filter */}
            <div className="space-y-2">
              <Label>Fornecedor</Label>
              <SearchableSelect
                options={
                  responsefornecedores?.map((f) => ({ id: String(f.id), name: f.nome })) || []
                }
                value={
                  filterValues.fornecedorId
                    ? {
                        id: filterValues.fornecedorId,
                        name:
                          responsefornecedores?.find(
                            (f) => f.id.toString() === filterValues.fornecedorId,
                          )?.nome || '',
                      }
                    : null
                }
                onChange={(option) =>
                  setFilterValues({
                    ...filterValues,
                    fornecedorId: option ? option.id.toString() : '',
                  })
                }
                placeholder="Selecione um fornecedor"
              />
            </div>

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
                step={1}
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

      {/* Tabela + Paginação */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <NotaFiscalCompraTable
            items={responseNotas?.notas || []}
            filterValues={appliedFilters}
            onSort={() => {}}
            onEdit={openEditModal}
            onDelete={(notaSelected) => {
              const nota = responseNotas?.notas?.find((nota) => nota.id === notaSelected.id);
              if (nota) openDeleteModal(nota);
            }}
          />

          <Pagination
            currentPage={appliedFilters.currentPage}
            totalPages={Math.ceil((responseNotas?.total || 0) / appliedFilters.itemsPerPage)}
            itemsPerPage={appliedFilters.itemsPerPage}
            totalItems={responseNotas?.total || 0}
            startIndex={(appliedFilters.currentPage - 1) * appliedFilters.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </CardContent>
      </Card>

      {/* Modais */}
      <ModalCreateNotaCompra
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        createForm={createForm}
        onSubmit={handleSubmitCreate}
        fornecedores={responsefornecedores || []}
      />

      <ModalEditNotaCompra
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editForm={editForm}
        onSubmit={handleSubmitEdit}
        fornecedores={responsefornecedores || []}
      />

      <ModalDeleteNotaCompra
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        selectedNota={selectedNota}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default NotasCompraPage;
