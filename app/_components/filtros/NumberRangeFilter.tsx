import { FC } from 'react';

interface NumberRangeFilterProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minPlaceholder: string;
  maxPlaceholder: string;
  label?: string;
  description?: string;
}

export const NumberRangeFilter: FC<NumberRangeFilterProps> = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder,
  maxPlaceholder,
  label,
  description,
}) => {
  return (
    <div className="filter-group">
      {label && <label className="filter-label font-bold">{label}</label>}
      {description && <p className="filter-description">{description}</p>}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder={minPlaceholder}
          className="filter-input"
        />
        <input
          type="number"
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder={maxPlaceholder}
          className="filter-input"
        />
      </div>
    </div>
  );
};
