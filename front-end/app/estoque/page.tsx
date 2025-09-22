'use client';

import { FC, useState } from 'react';
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
import { Pagination } from '@/app/_components/Pagination';
import { TextFilter } from '@/app/_components/filtros/TextFilter';
import { NumberRangeFilter } from '@/app/_components/filtros/NumberRangeFilter';
import { FilterContainer } from '@/app/_components/common/FilterContainer';
import { EstoqueForm, EstoqueFormData } from '@/app/_components/estoque/EstoqueForm';
import { EstoqueTable } from '@/app/_components/estoque/EstoqueTable';
import { useEstoque } from '@/app/_components/hooks/useEstoque';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';
import { ModalEstoqueCreate } from '../_components/modals/estoque/ModalEstoqueCreate';
import { ModalEditEstoque } from '../_components/modals/estoque/ModalEditEstoque';
import { ModalDeleteEstoque } from '../_components/modals/estoque/ModalDeleteEstoque';
import { useProduto } from '../_components/hooks/useProduto';

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
    handleSort,
    getEstoqueByParams
  } = useEstoque();
  
  const { getAllProdutos } = useProduto()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProdutoEstoque | null>(null);

  const { data: response, isLoading, error } = getEstoqueByParams()
  const { data: produtos, isLoading: isLoadingProduto, error: errorProduto } = getAllProdutos()

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
          <Button onClick={() => setIsCreateModalOpen(true)}>Novo Item</Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os itens do estoque por nome, quantidade ou preço
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterContainer
            title=""
            description=""
            onReset={resetFilters}
            onApply={handleApply}
          >
            <TextFilter
              value={appliedFilters.search || ''}
              onChange={(search) =>
                updateUrl({ ...appliedFilters, search, currentPage: 1 })
              }
              placeholder="Pesquisar itens..."
              label="Busca por Nome"
              description="Digite o nome do produto que deseja encontrar"
            />

            <NumberRangeFilter
              minValue={appliedFilters.quantidadeMin}
              maxValue={appliedFilters.quantidadeMax}
              onMinChange={(quantidadeMin) =>
                updateUrl({ ...appliedFilters, quantidadeMin, currentPage: 1 })
              }
              onMaxChange={(quantidadeMax) =>
                updateUrl({ ...appliedFilters, quantidadeMax, currentPage: 1 })
              }
              minPlaceholder="Quantidade mínima"
              maxPlaceholder="Quantidade máxima"
              label="Quantidade em Estoque"
              description="Filtre por faixa de quantidade disponível"
            />

            <NumberRangeFilter
              minValue={appliedFilters.precoMin}
              maxValue={appliedFilters.precoMax}
              onMinChange={(precoMin) =>
                updateUrl({ ...appliedFilters, precoMin, currentPage: 1 })
              }
              onMaxChange={(precoMax) =>
                updateUrl({ ...appliedFilters, precoMax, currentPage: 1 })
              }
              minPlaceholder="Preço mínimo"
              maxPlaceholder="Preço máximo"
              label="Faixa de Preço"
              description="Filtre por faixa de preço dos itens"
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
        <CardContent className="pt-6">
          <EstoqueTable
            items={response?.estoque || []}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={(id) => {
              const item = response?.estoque.find((i) => i.id === id);
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
