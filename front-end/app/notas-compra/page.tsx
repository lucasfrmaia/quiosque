'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterValues, SortDirection, NotaFiscalCompra } from '@/types/interfaces/entities';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/app/_components/Pagination';
import { NotaFiscalCompraTable } from '@/app/_components/nota-fiscal-compra/NotaFiscalCompraTable';
import { useNotaFiscalCompra } from '@/app/_components/hooks/useNotaFiscalCompra';
import { useFornecedor } from '@/app/_components/hooks/useFornecedor';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';
import { notaFiscalCompraSchema } from '../_components/validation';
import { ModalCreateNotaCompra } from '../_components/modals/notas-compras/ModalCreateNotaCompra';
import { ModalEditNotaCompra } from '../_components/modals/notas-compras/ModalEditeNotaCompra';
import { ModalDeleteNotaCompra } from '../_components/modals/notas-compras/ModalDeleteNotaCompra';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const NotasCompraPage: FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  /** Filtros padrão */
  const defaultFilters: FilterValues = {
    currentPage: 1,
    itemsPerPage: 10,
    search: '',
    quantidadeMin: '',
    quantidadeMax: '',
    precoMin: '',
    precoMax: '',
  };

  /** Extrai filtros da URL */
  const { handleCreate, handleEdit, handleDelete, getNotasFiscaisCompras, updateUrl, resetFilters, queryParams } = useNotaFiscalCompra();
  const { data: responseNotas, isLoading, error } = getNotasFiscaisCompras()

  const { getAllFornecedores } = useFornecedor();
  const { data: responsefornecedores, isLoading: isLoadingFornecedor, error: errorFornecedor } = getAllFornecedores()

  /** Estados de filtros aplicados e pendentes */
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(queryParams);
  const [localSearch, setLocalSearch] = useState(appliedFilters.search || '');

  useEffect(() => {
    setLocalSearch(appliedFilters.search || '');
  }, [appliedFilters.search]);


  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<NotaFiscalCompra | null>(null);

  /** Forms */
  const createForm = useForm<notaFiscalCompraSchema>({
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
      fornecedorId: '',
      total: '',
      produtos: [],
    },
  });

  const editForm = useForm<notaFiscalCompraSchema>({
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
      fornecedorId: '',
      total: '',
      produtos: [],
    },
  });

  const handleSearch = useCallback(() => {
    const newFilters = { ...appliedFilters, search: localSearch, currentPage: 1 };
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
  }, [appliedFilters, localSearch, updateUrl]);

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
      fornecedorId: Number(data.fornecedorId),
      total: Number(data.total),
      produtos: data.produtos.map(p => ({
        notaFiscalId: 0,
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
      fornecedorId: Number(data.fornecedorId),
      total: Number(data.total),
    });
    setIsEditModalOpen(false);
    setSelectedNota(null);
    editForm.reset();
  });

  const openEditModal = (nota: NotaFiscalCompra) => {
    setSelectedNota(nota);
    editForm.setValue('data', nota.data.toDateString());
    editForm.setValue('fornecedorId', nota.fornecedorId.toString());
    editForm.setValue('total', nota.total.toString());
    editForm.setValue('produtos', nota.produtos?.map(p => ({
      produtoId: p.produtoId.toString(),
      quantidade: p.quantidade.toString(),
      unidade: p.unidade,
      precoUnitario: p.precoUnitario.toString(),
    })) || []);
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

  /** Filtros ativos */
  const getActiveFilters = () => {
    const active = [];
    if (appliedFilters.search) active.push({ label: 'Pesquisa', value: appliedFilters.search });
    return active;
  };

  const handleRemoveFilter = (index: number) => {
    const activeFilters = getActiveFilters();
    const filterToRemove = activeFilters[index];

    let newFilters = { ...appliedFilters };
    if (filterToRemove.label === 'Pesquisa') newFilters.search = '';
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
  };

 if (isLoading || isLoadingFornecedor) {
    return <>Carregando...</>
 }

 if (error || errorFornecedor) {
    console.error(error, "ou", errorFornecedor)
    return <>Error!</>
 }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Notas Fiscais de Compra</CardTitle>
            <CardDescription>Gerencie as notas fiscais de compra</CardDescription>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Nova Nota</Button>
        </CardHeader>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar por ID ou fornecedor..."
                value={localSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalSearch(e.target.value)}
                className="pl-10 pr-4 rounded-xl border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 shadow-md transition-all duration-200 hover:shadow-lg"
              />
              {localSearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-9 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setLocalSearch('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button onClick={handleSearch} variant="default" size="sm">
              Buscar
            </Button>
            <Button onClick={resetFilters} variant="outline" size="sm">
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtros ativos */}
      <ActiveFilters
        filters={getActiveFilters()}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={resetFilters}
      />

      {/* Tabela + Paginação */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <NotaFiscalCompraTable
            items={responseNotas?.notas || []}
            filterValues={appliedFilters}
            onSort={() => { }}
            onEdit={openEditModal}
            onDelete={(id) => {
              const nota = responseNotas?.notas?.find(nota => nota.id === id);
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
        handleSubmitCreate={handleSubmitCreate}
        fornecedores={responsefornecedores || []}
      />

      <ModalEditNotaCompra
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editForm={editForm}
        handleSubmitEdit={handleSubmitEdit}
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
