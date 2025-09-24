'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FilterValues, NotaFiscalVenda } from '@/types/interfaces/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pagination } from '@/app/_components/Pagination';
import { NotaFiscalVendaTable } from '@/app/_components/nota-fiscal-venda/NotaFiscalVendaTable';
import { NotaFiscalVendaFormData } from '@/app/_components/nota-fiscal-venda/NotaFiscalVendaForm';
import { useNotasFiscaisVendas } from '@/app/_components/hooks/useNotasFiscalVendas';

import { ModalCreateNotaVenda } from '../_components/modals/nota-vendas/ModalCreateNotaVenda';
import { ModalEditNotaVenda } from '../_components/modals/nota-vendas/ModalEditNotaVenda';
import { ModalDeleteNotaVenda } from '../_components/modals/nota-vendas/ModalDeleteNotaVenda';

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
    handleSort,
    getNotasByParams,
  } = useNotasFiscaisVendas();

  const { data: response, isLoading, error } = getNotasByParams();

  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(queryParams);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<NotaFiscalVenda | null>(null);
  const [localSearch, setLocalSearch] = useState('');

  const createForm = useForm<NotaFiscalVendaFormData>({
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
      total: '',
      produtos: [],
    },
  });
  const editForm = useForm<NotaFiscalVendaFormData>({
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
      total: '',
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
      data: data.data,
      total: Number(data.total),
      produtos: data.produtos.map((p) => ({
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
      total: Number(data.total),
    });
    setIsEditModalOpen(false);
    setSelectedNota(null);
    editForm.reset();
  });

  const openEditModal = (nota: NotaFiscalVenda) => {
    setSelectedNota(nota);
    editForm.setValue('data', nota.data.split('T')[0]);
    editForm.setValue('total', nota.total.toString());
    editForm.setValue(
      'produtos',
      nota.produtos?.map((p) => ({
        produtoId: p.produtoId.toString(),
        quantidade: p.quantidade.toString(),
        unidade: p.unidade,
        precoUnitario: p.precoUnitario.toString(),
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Notas Fiscais de Venda
            </CardTitle>
            <CardDescription>Gerencie as notas fiscais de venda</CardDescription>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Nova Nota</Button>
        </CardHeader>
      </Card>

      {/* Search Bar */}
      <Card className="border-blue-100 shadow-sm">
        <CardContent className="p-4">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar notas fiscais..."
                value={localSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setLocalSearch(e.target.value);
                }}
                className="pl-10 pr-4 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-md transition-all duration-200 hover:shadow-lg"
              />
              {localSearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-9 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => {
                    setLocalSearch('');
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button onClick={handleSearch} variant="default" size="sm">
              Buscar Notas
            </Button>
            <Button onClick={resetFilters} variant="outline" size="sm">
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <NotaFiscalVendaTable
            items={response?.data || []}
            filterValues={appliedFilters}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(id) => {
              const nota = response?.data?.find((n) => n.id === id.id);
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
