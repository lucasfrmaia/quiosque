'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FilterValues, NotaFiscalVenda } from '@/types/interfaces/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Search, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pagination } from '@/app/_components/Pagination';
import { NotaFiscalVendaTable } from '@/app/_components/nota-fiscal-venda/NotaFiscalVendaTable';
import { useNotasFiscaisVendas } from '@/app/_components/hooks/useNotasFiscalVendas';

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
    handleSort
  } = useNotasFiscaisVendas();

  const { data: response, isLoading, error } = getNotasByParams();

  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(queryParams);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<NotaFiscalVenda | null>(null);
  const [localSearch, setLocalSearch] = useState('');

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

  useEffect(() => {
    setLocalSearch(queryParams.search || '');
  }, [queryParams.search]);

  const handleSearch = useCallback(() => {
    const newFilters = { ...queryParams, search: localSearch, currentPage: 1 };
    updateUrl(newFilters);
  }, [queryParams, localSearch, updateUrl]);

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
                  const newFilters = { ...queryParams, search: '', currentPage: 1 };
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
            onClick={resetFilters}
            className="rounded-xl border-2 border-green-300 hover:bg-green-50 hover:border-green-500 flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-200"
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

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
            currentPage={queryParams.currentPage}
            totalPages={Math.ceil((response?.total || 0) / queryParams.itemsPerPage)}
            itemsPerPage={queryParams.itemsPerPage}
            totalItems={response?.total || 0}
            startIndex={(queryParams.currentPage - 1) * queryParams.itemsPerPage}
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
