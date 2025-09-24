'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterValues, SortDirection, NotaFiscalCompra } from '@/types/interfaces/entities';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/app/_components/Pagination';
import { TextFilter } from '@/app/_components/filtros/TextFilter';
import { FilterContainer } from '@/app/_components/common/FilterContainer';
import { NotaFiscalCompraTable } from '@/app/_components/nota-fiscal-compra/NotaFiscalCompraTable';
import { useNotaFiscalCompra } from '@/app/_components/hooks/useNotaFiscalCompra';
import { useFornecedor } from '@/app/_components/hooks/useFornecedor';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';
import { notaFiscalCompraSchema } from '../_components/validation';
import { ModalCreateNotaCompra } from '../_components/modals/notas-compras/ModalCreateNotaCompra';
import { ModalEditNotaCompra } from '../_components/modals/notas-compras/ModalEditeNotaCompra';
import { ModalDeleteNotaCompra } from '../_components/modals/notas-compras/ModalDeleteNotaCompra';

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
  const getFiltersFromParams = useCallback((): FilterValues => {
    const params = new URLSearchParams(searchParams.toString());
    return {
      ...defaultFilters,
      currentPage: parseInt(params.get('page') || defaultFilters.currentPage.toString()) || defaultFilters.currentPage,
      itemsPerPage: parseInt(params.get('limit') || defaultFilters.itemsPerPage.toString()) || defaultFilters.itemsPerPage,

      search: params.get('search') || defaultFilters.search,
      quantidadeMin: params.get('quantidadeMin') || defaultFilters.quantidadeMin,
      quantidadeMax: params.get('quantidadeMax') || defaultFilters.quantidadeMax,
      precoMin: params.get('precoMin') || defaultFilters.precoMin,
      precoMax: params.get('precoMax') || defaultFilters.precoMax,
    };
  }, [searchParams]);

  /** Estados de filtros aplicados e pendentes */
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(getFiltersFromParams());
  const [pendingFilters, setPendingFilters] = useState<FilterValues>(appliedFilters);

  useEffect(() => {
    setPendingFilters(appliedFilters);
  }, [appliedFilters]);

  /** Hook da entidade */
  const { handleCreate, handleEdit, handleDelete, getNotasFiscaisCompras } = useNotaFiscalCompra();
  const { data: responseNotas , isLoading, error } = getNotasFiscaisCompras()

  /** Fornecedores (para selects no formulário) */
  const { getAllFornecedores } = useFornecedor();
  const { data: responsefornecedores, isLoading: isLoadingFornecedor, error: errorFornecedor } = getAllFornecedores()

  /** Estados de modais */
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

  /** Atualiza URL com filtros */
  const updateUrl = useCallback((newFilters: FilterValues) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newFilters.currentPage.toString());
    params.set('limit', newFilters.itemsPerPage.toString());

    newFilters.search ? params.set('search', newFilters.search) : params.delete('search');
    newFilters.quantidadeMin ? params.set('quantidadeMin', newFilters.quantidadeMin) : params.delete('quantidadeMin');
    newFilters.quantidadeMax ? params.set('quantidadeMax', newFilters.quantidadeMax) : params.delete('quantidadeMax');
    newFilters.precoMin ? params.set('precoMin', newFilters.precoMin) : params.delete('precoMin');
    newFilters.precoMax ? params.set('precoMax', newFilters.precoMax) : params.delete('precoMax');

    router.replace(`?${params.toString()}`);
  }, [router, searchParams]);

  /** Filtros */
  const handleApply = () => {
    const newFilters = { ...pendingFilters, currentPage: 1 };
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
  };

  const resetFilters = () => {
    setPendingFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    router.replace(`?`);
  };

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
      data: data.data,
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
      data: data.data,
      fornecedorId: Number(data.fornecedorId),
      total: Number(data.total),
    });
    setIsEditModalOpen(false);
    setSelectedNota(null);
    editForm.reset();
  });

  const openEditModal = (nota: NotaFiscalCompra) => {
    setSelectedNota(nota);
    editForm.setValue('data', nota.data.split('T')[0]);
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

  if (isLoading || isLoadingFornecedor) return <>Carregando...</>
  if (error || errorFornecedor) return <>Error</>

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
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre as notas por ID ou fornecedor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterContainer onReset={resetFilters} onApply={handleApply}>
            <TextFilter
              value={pendingFilters.search || ""}
              onChange={(search) => setPendingFilters(prev => ({ ...prev, search }))}
              placeholder="Pesquisar por ID ou fornecedor..."
              label="Pesquisa"
              description="Digite o ID da nota ou nome do fornecedor"
            />
          </FilterContainer>
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
            onEdit={openEditModal}
            onDelete={openDeleteModal}
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
