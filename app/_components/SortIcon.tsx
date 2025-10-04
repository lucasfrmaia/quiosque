import { FC } from 'react';

interface SortIconProps {
  field: string;
  currentSortField: string;
  currentSortDirection: 'asc' | 'desc';
}

export const SortIcon: FC<SortIconProps> = ({ field, currentSortField, currentSortDirection }) => {
  if (currentSortField !== field) return <span className="text-gray-300">↕</span>;
  return currentSortDirection === 'asc' ? <span>↑</span> : <span>↓</span>;
};
