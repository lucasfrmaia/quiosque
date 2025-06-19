import { FC } from 'react';

interface TextFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  description?: string;
}

export const TextFilter: FC<TextFilterProps> = ({ 
  value, 
  onChange, 
  placeholder,
  label,
  description 
}) => {
  return (
    <div className="filter-group">
      {label && (
        <label className="filter-label font-bold">
          {label}
        </label>
      )}
      {description && (
        <p className="filter-description">
          {description}
        </p>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="filter-input"
      />
    </div>
  );
};