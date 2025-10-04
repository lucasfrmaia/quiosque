import { FC } from 'react';
import { FiX } from 'react-icons/fi';

interface ActiveFilterProps {
  label: string;
  value: string;
  onRemove: () => void;
}

interface ActiveFiltersProps {
  filters: {
    label: string;
    value: string;
  }[];
  onRemoveFilter: (index: number) => void;
  onClearAll: () => void;
}

const ActiveFilter: FC<ActiveFilterProps> = ({ label, value, onRemove }) => (
  <div className="inline-flex items-center bg-green-50 text-green-700 rounded-full px-3 py-1 text-sm">
    <span className="font-medium mr-1">{label}:</span>
    <span className="mr-2">{value}</span>
    <button
      onClick={onRemove}
      className="text-green-500 hover:text-green-700 transition-colors"
      title="Remover filtro"
    >
      <FiX size={16} />
    </button>
  </div>
);

export const ActiveFilters: FC<ActiveFiltersProps> = ({ filters, onRemoveFilter, onClearAll }) => {
  if (filters.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">Filtros Ativos</h4>
        <button
          onClick={onClearAll}
          className="text-sm text-green-600 hover:text-green-800 transition-colors"
        >
          Limpar Todos
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <ActiveFilter
            key={`${filter.label}-${index}`}
            label={filter.label}
            value={filter.value}
            onRemove={() => onRemoveFilter(index)}
          />
        ))}
      </div>
    </div>
  );
};
