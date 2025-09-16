'use client';

import { FC, useState, useEffect } from 'react';
import { NotaFiscalCompra } from '@/types/interfaces/entities';
import { Fornecedor } from '@/types/interfaces/entities';
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
import { NotaFiscalCompraTable } from '@/app/_components/nota-fiscal-compra/NotaFiscalCompraTable';
import { NotaFiscalCompraForm } from '@/app/_components/nota-fiscal-compra/NotaFiscalCompraForm';
import { useNotaFiscalCompra } from '@/app/_components/hooks/useNotaFiscalCompra';
import { useFornecedor } from '@/app/_components/hooks/useFornecedor';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';

const NotasCompraPage: FC = () => {
  const {
    notas,
    filteredNotas,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
  } = useNotaFiscalCompra();

  const { fornecedores } = useFornecedor();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<NotaFiscalCompra | null>(null);
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    fornecedorId: '',
    total: '',
    produtos: [] as Array<{
      produtoId: string;
      quantidade: string;
      unidade: string;
      precoUnitario: string;
    }>,
  });

  const handleSubmitCreate = () => {
    handleCreate({
      data: formData.data,
      fornecedorId: Number(formData.fornecedorId),
      total: Number(formData.total),
      produtos: formData.produtos.map(p => ({
        notaFiscalId: 0,
        produtoId: Number(p.produtoId),
        quantidade: Number(p.quantidade),
        unidade: p.unidade,
        precoUnitario: Number(p.precoUnitario),
      })),
    });
    setIsCreateModalOpen(false);
    setFormData({
      data: new Date().toISOString().split('T')[0],
      fornecedorId: '',
      total: '',
      produtos: [],
    });
  };

  const handleSubmitEdit = () => {
    if (!selectedNota) return;
    handleEdit(selectedNota.id, {
      data: formData.data,
      fornecedorId: Number(formData.fornecedorId),
      total: Number(formData.total),
    });
    setIsEditModalOpen(false);
    setSelectedNota(null);
    setFormData({
      data: new Date().toISOString().split('T')[0],
      fornecedorId: '',
      total: '',
      produtos: [],
    });
  };

  const openEditModal = (nota: NotaFiscalCompra) => {
    setSelectedNota(nota);
    setFormData({
      data: nota.data.split('T')[0],
      fornecedorId: nota.fornecedorId.toString(),
      total: nota.total.toString(),
      produtos: nota.produtos?.map(p => ({
        produtoId: p.produtoId.toString(),
        quantidade: p.quantidade.toString(),
        unidade: p.unidade,
        precoUnitario: p.precoUnitario.toString(),
      })) || [],
    });
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

  const getActiveFilters = () => {
    const active = [];
    if (filterValues.search) {
      active.push({ label: 'Pesquisa', value: filterValues.search });
    }
    return active;
  };

  const handleRemoveFilter = (index: number) => {
    const activeFilters = getActiveFilters();
    const filterToRemove = activeFilters[index];
    
    switch (filterToRemove.label) {
      case 'Pesquisa':
        handleFilter({ search: '' });
        break;
    }
  };

  const resetFilters = () => {
    handleFilter({
      search: '',
      currentPage: 1,
      itemsPerPage: 10,
      sortField: 'data',
      sortDirection: 'desc'
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Notas Fiscais de Compra</CardTitle>
            <CardDescription>Gerencie as notas fiscais de compra</CardDescription>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Nova Nota</Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre as notas por ID ou fornecedor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterContainer
            title=""
            description=""
            onReset={resetFilters}
          >
            <TextFilter
              value={filterValues.search}
              onChange={(search) => handleFilter({ search })}
              placeholder="Pesquisar por ID ou fornecedor..."
              label="Pesquisa"
              description="Digite o ID da nota ou nome do fornecedor"
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
          <NotaFiscalCompraTable
            items={notas}
            filterValues={filterValues}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />

          <Pagination
            currentPage={filterValues.currentPage}
            totalPages={Math.ceil(filteredNotas.length / filterValues.itemsPerPage)}
            itemsPerPage={filterValues.itemsPerPage}
            totalItems={filteredNotas.length}
            startIndex={(filterValues.currentPage - 1) * filterValues.itemsPerPage}
            onPageChange={(page) => handleFilter({ currentPage: page })}
            onItemsPerPageChange={(itemsPerPage) => handleFilter({ itemsPerPage, currentPage: 1 })}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Nota Fiscal de Compra</DialogTitle>
            <DialogDescription>Crie uma nova nota fiscal de compra.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <NotaFiscalCompraForm 
              formData={formData} 
              onChange={setFormData} 
              fornecedores={fornecedores}
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Nota Fiscal de Compra</DialogTitle>
            <DialogDescription>Edite a nota fiscal de compra.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <NotaFiscalCompraForm 
              formData={formData} 
              onChange={setFormData} 
              fornecedores={fornecedores}
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
              Tem certeza que deseja excluir a nota fiscal de compra #{selectedNota?.id}? Esta ação não pode ser desfeita.
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

export default NotasCompraPage;