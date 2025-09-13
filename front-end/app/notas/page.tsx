'use client';

import { FC } from 'react';
import { Pagination } from '@/app/_components/Pagination';
import { TextFilter } from '@/app/_components/filtros/TextFilter';
import { NumberRangeFilter } from '@/app/_components/filtros/NumberRangeFilter';
import { DateRangeFilter } from '@/app/_components/filtros/DateRangeFilter';
import { PageHeader } from '@/app/_components/common/PageHeader';
import { FilterContainer } from '@/app/_components/common/FilterContainer';
import { NotasTable } from '@/app/_components/notas/NotasTable';
import { useNotas } from '@/app/_components/hooks/useNotas';
import { ActiveFilters } from '@/app/_components/filtros/ActiveFilters';

const NotasPage: FC = () => {
  const {
    paginatedNotas,
    filteredNotas,
    filterValues,
    handleSort,
    handleFilter,
    setAppliedFilters
  } = useNotas();

  const getActiveFilters = () => {
    const active = [];
    if (filterValues.search) {
      active.push({ label: 'ID do Produto', value: filterValues.search });
    }
    if (filterValues.quantidadeMin) {
      active.push({ label: 'Quantidade Mínima', value: filterValues.quantidadeMin });
    }
    if (filterValues.quantidadeMax) {
      active.push({ label: 'Quantidade Máxima', value: filterValues.quantidadeMax });
    }
    if (filterValues.totalMin) {
      active.push({ label: 'Total Mínimo', value: `R$ ${filterValues.totalMin}` });
    }
    if (filterValues.totalMax) {
      active.push({ label: 'Total Máximo', value: `R$ ${filterValues.totalMax}` });
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
      case 'ID do Produto':
        handleFilter({ search: '' });
        break;
      case 'Quantidade Mínima':
        handleFilter({ quantidadeMin: '' });
        break;
      case 'Quantidade Máxima':
        handleFilter({ quantidadeMax: '' });
        break;
      case 'Total Mínimo':
        handleFilter({ totalMin: '' });
        break;
      case 'Total Máximo':
        handleFilter({ totalMax: '' });
        break;
      case 'Data Inicial':
        handleFilter({ dataInicio: '' });
        break;
      case 'Data Final':
        handleFilter({ dataFim: '' });
        break;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notas Fiscais"
        onCreateClick={() => {}}
        createButtonLabel=""
      />

      <FilterContainer
        title="Filtros de Notas Fiscais"
        description="Pesquise notas fiscais por ID do produto, quantidade, valor total ou período"
        onReset={() => {
          setAppliedFilters({
            search: '',
            quantidadeMin: '',
            quantidadeMax: '',
            totalMin: '',
            totalMax: '',
            dataInicio: '',
            dataFim: '',
            currentPage: 1,
            itemsPerPage: 5,
            sortField: 'data',
            sortDirection: 'desc'
          });
          handleFilter({
            search: '',
            quantidadeMin: '',
            quantidadeMax: '',
            totalMin: '',
            totalMax: '',
            dataInicio: '',
            dataFim: '',
            currentPage: 1
          });
        }}
        onApply={() => setAppliedFilters(filterValues)}
      >
        <TextFilter
          value={filterValues.search}
          onChange={(search) => handleFilter({ search })}
          placeholder="Pesquisar por ID do produto..."
          label="ID do Produto"
          description="Digite o ID do produto para filtrar as notas"
        />
        
        <NumberRangeFilter
          minValue={filterValues.quantidadeMin}
          maxValue={filterValues.quantidadeMax}
          onMinChange={(quantidadeMin) => handleFilter({ quantidadeMin })}
          onMaxChange={(quantidadeMax) => handleFilter({ quantidadeMax })}
          minPlaceholder="Quantidade mín"
          maxPlaceholder="Quantidade máx"
          label="Quantidade"
          description="Filtre por faixa de quantidade de itens"
        />
        
        <NumberRangeFilter
          minValue={filterValues.totalMin}
          maxValue={filterValues.totalMax}
          onMinChange={(totalMin) => handleFilter({ totalMin })}
          onMaxChange={(totalMax) => handleFilter({ totalMax })}
          minPlaceholder="Total mínimo"
          maxPlaceholder="Total máximo"
          label="Valor Total"
          description="Filtre por faixa de valor total da nota"
        />
        
        <div className="md:col-span-2 lg:col-span-3">
          <DateRangeFilter
            startDate={filterValues.dataInicio}
            endDate={filterValues.dataFim}
            onStartDateChange={(dataInicio) => handleFilter({ dataInicio })}
            onEndDateChange={(dataFim) => handleFilter({ dataFim })}
            label="Período da Nota"
            description="Selecione o intervalo de datas de emissão das notas"
          />
        </div>
      </FilterContainer>

      <ActiveFilters
        filters={getActiveFilters()}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={() => handleFilter({
          search: '',
          quantidadeMin: '',
          quantidadeMax: '',
          totalMin: '',
          totalMax: '',
          dataInicio: '',
          dataFim: '',
          currentPage: 1,
        })}
      />

      <div className="bg-white p-4 rounded-lg shadow">
        <NotasTable
          items={paginatedNotas}
          filterValues={filterValues}
          onSort={handleSort}
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
      </div>
    </div>
  );
};

export default NotasPage;