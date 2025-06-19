import { FC } from 'react';
import { FiPlus } from 'react-icons/fi';

interface CreateButtonProps {
  onClick: () => void;
  label: string;
}

export const CreateButton: FC<CreateButtonProps> = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
    >
      <FiPlus size={20} />
      <span>{label}</span>
    </button>
  );
};