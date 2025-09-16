'use client';

import { FC, useState } from 'react';
import { ProdutoCompra } from '@/types/interfaces/entities';
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
import { DateRangeFilter } from '@/app/_components/filtros/DateRangeFilter';
import { FilterContainer } from '@/app/_components/common/FilterContainer';
import { GastosForm } from '@/app/_components/gastos/GastosForm';
import { GastosTable } from '@/app/_components/gastos/GastosTable';
import { useGastos } from '@/app/_components/hooks/useGastos';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';

const GastosPage: FC = () => {
  const {
    paginatedGastos,
    filteredGastos,
    filterValues,
    handleSort,
    handleFilter,
    handleCreate,
    handleEdit,
    handleDelete,
  } = useGastos();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState<ProdutoCompra | null>(null);
  const [formData, setFormData] = useState({ produtoId: '', quantidade: '', precoUnitario: '', unidade: '', notaFiscalId: '' });

  const handleSubmitCreate = () => {
    handleCreate({
      produtoId: Number(formData.produtoId),
      quantidade: Number(formData.quantidade),
      precoUnitario: Number(formData.precoUnitario),
      unidade: formData.unidade,
      notaFiscalId: Number(formData.notaFiscalId),
    });
    setIsCreateModalOpen(false);
    setFormData({ produtoId: '', quantidade: '', precoUnitario: '', unidade: '', notaFiscalId: '' });
  };

  const handleSubmitEdit = () => {
    if (!selectedGasto) return;
    handleEdit(selectedGasto.id, {
      produtoId: Number(formData.produtoId),
      quantidade: Number(formData.quantidade),
      precoUnitario: Number(formData.precoUnitario),
      unidade: formData.unidade,
      notaFiscalId: Number(formData.notaFiscalId),
    });
    setIsEditModalOpen(false);
    setSelectedGasto(null);
    setFormData({ produtoId: '', quantidade: '', precoUnitario: '', unidade: '', notaFiscalId: '' });
  };

  const openEditModal = (gasto: ProdutoCompra) => {
    setSelectedGasto(gasto);
    setFormData({
      produtoId: gasto.produtoId.toString(),
      quantidade: gasto.quantidade.toString(),
      precoUnitario: gasto.precoUnitario.toString(),
      unidade: gasto.unidade,
      notaFiscalId: gasto.notaFiscalId.toString(),
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (gasto: ProdutoCompra) => {
    setSelectedGasto(gasto);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedGasto) return;
    handleDelete(selectedGasto.id);
    setIsDeleteModalOpen(false);
    setSelectedGasto(null);
  };

  const getActiveFilters = () => {
    const active = [];
    if (filterValues.search) {
      active.push({ label: 'Produto', value: filterValues.search });
    }
    if (filterValues.precoMin) {
      active.push({ label: 'Preço Mínimo', value: `R$ ${filterValues.precoMin}` });
    }
    if (filterValues.precoMax) {
      active.push({ label: 'Preço Máximo', value: `R$ ${filterValues.precoMax}` });
    }
    if (filterValues.quantidadeMin) {
      active.push({ label: 'Quantidade Mínima', value: filterValues.quantidadeMin });
    }
    if (filterValues.quantidadeMax) {
      active.push({ label: 'Quantidade Máxima', value: filterValues.quantidadeMax });
    }
    if (filterValues.dataInicio) {
      active.push({ 
        label: 'Data Inicial', 
        value: new Date(filterValues.dataInicio).toLocaleDateString() 
      });
    }
    if (filterValues.dataFim) {
      active.push({ 
        label: 'Data Final', 
        value: new Date(filterValues.dataFim).toLocaleDateString() 
      });
    }
    return active;
  };

  const handleRemoveFilter = (index: number) => {
    const activeFilters = getActiveFilters();
    const filterToRemove = activeFilters[index];
    
    switch (filterToRemove.label) {
      case 'Produto':
        handleFilter({ search: '' });
        break;
      case 'Preço Mínimo':
        handleFilter({ precoMin: '' });
        break;
      case 'Preço Máximo':
        handleFilter({ precoMax: '' });
        break;
      case 'Quantidade Mínima':
        handleFilter({ quantidadeMin: '' });
        break;
      case 'Quantidade Máxima':
        handleFilter({ quantidadeMax: '' });
        break;
      case 'Data Inicial':
        handleFilter({ dataInicio: '' });
        break;
      case 'Data Final':
        handleFilter({ dataFim: '' });
        break;
    }
  };

  const handleResetFilters = () => {
    handleFilter({
      search: '',
      precoMin: '',
      precoMax: '',
      quantidadeMin: '',
      quantidadeMax: '',
      dataInicio: '',
      dataFim: '',
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
            <CardTitle className="text-2xl font-bold">Compras de Produtos</CardTitle>
            <CardDescription>Gerencie as compras de produtos</CardDescription>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Nova Compra</Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre as compras por produto, preço, quantidade ou período</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterContainer
            title=""
            description=""
            onReset={handleResetFilters}
            onApply={() => {}}
          >
            <TextFilter
              value={filterValues.search}
              onChange={(search) => handleFilter({ search })}
              placeholder="Pesquisar por produto..."
              label="Busca por Produto"
              description="Digite o nome do produto que deseja encontrar"
            />
            
            <NumberRangeFilter
              minValue={filterValues.precoMin}
              maxValue={filterValues.precoMax}
              onMinChange={(precoMin) => handleFilter({ precoMin })}
              onMaxChange={(precoMax) => handleFilter({ precoMax })}
              minPlaceholder="Preço mínimo"
              maxPlaceholder="Preço máximo"
              label="Faixa de Preço"
              description="Filtre compras por faixa de preço"
            />
            
            <NumberRangeFilter
              minValue={filterValues.quantidadeMin}
              maxValue={filterValues.quantidadeMax}
              onMinChange={(quantidadeMin) => handleFilter({ quantidadeMin })}
              onMaxChange={(quantidadeMax) => handleFilter({ quantidadeMax })}
              minPlaceholder="Quantidade mínima"
              maxPlaceholder="Quantidade máxima"
              label="Faixa de Quantidade"
              description="Filtre por faixa de quantidade comprada"
            />

            <DateRangeFilter
              startDate={filterValues.dataInicio}
              endDate={filterValues.dataFim}
              onStartDateChange={(dataInicio) => handleFilter({ dataInicio })}
              onEndDateChange={(dataFim) => handleFilter({ dataFim })}
              label="Período"
              description="Selecione o intervalo de datas das compras"
            />
          </FilterContainer>
        </CardContent>
      </Card>

      <ActiveFilters
        filters={getActiveFilters()}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleResetFilters}
      />

      <Card>
        <CardContent className="pt-6 space-y-6">
          <GastosTable
            items={paginatedGastos}
            filterValues={filterValues}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(id) => {
              const gasto = paginatedGastos.find(g => g.id === id);
              if (gasto) openDeleteModal(gasto);
            }}
          />

          <Pagination
            currentPage={filterValues.currentPage}
            totalPages={Math.ceil(filteredGastos.length / filterValues.itemsPerPage)}
            itemsPerPage={filterValues.itemsPerPage}
            totalItems={filteredGastos.length}
            startIndex={(filterValues.currentPage - 1) * filterValues.itemsPerPage}
            onPageChange={(page) => handleFilter({ currentPage: page })}
            onItemsPerPageChange={(itemsPerPage) => handleFilter({ itemsPerPage, currentPage: 1 })}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Compra</DialogTitle>
            <DialogDescription>Crie uma nova compra de produto.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <GastosForm formData={formData} onChange={setFormData} />
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
            <DialogTitle>Editar Compra</DialogTitle>
            <DialogDescription>Edite a compra de produto.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <GastosForm formData={formData} onChange={setFormData} />
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
              Tem certeza que deseja excluir a compra "{selectedGasto?.produto?.nome}"? Esta ação não pode ser desfeita.
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

export default GastosPage;