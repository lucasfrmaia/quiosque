import { FC } from 'react';
import { CreateButton } from '../CreateButton';

interface PageHeaderProps {
  title: string;
  onCreateClick: () => void;
  createButtonLabel: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, onCreateClick, createButtonLabel }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold text-black">{title}</h1>
      <CreateButton onClick={onCreateClick} label={createButtonLabel} />
    </div>
  );
};