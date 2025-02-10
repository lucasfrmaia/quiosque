import { FC } from 'react';

interface TextFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const TextFilter: FC<TextFilterProps> = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="filter-input"
    />
  );
};