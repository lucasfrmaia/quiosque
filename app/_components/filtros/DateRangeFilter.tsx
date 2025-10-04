import { FC } from 'react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  label?: string;
  description?: string;
}

export const DateRangeFilter: FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label = 'Período',
  description = 'Selecione o intervalo de datas',
}) => {
  return (
    <div className="filter-group">
      {label && <label className="filter-label font-bold">{label}</label>}
      {description && <p className="filter-description">{description}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Data inicial</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Data final</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>
    </div>
  );
};
