import { FC, ReactNode } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface ActionButtonProps {
  onClick: () => void;
  variant: 'edit' | 'delete';
}

export const ActionButton: FC<ActionButtonProps> = ({ onClick, variant }) => {
  const baseClasses = "p-2 rounded-lg transition-all duration-200 inline-flex items-center justify-center";
  const variantClasses = {
    edit: "text-blue-600 hover:bg-blue-50",
    delete: "text-red-600 hover:bg-red-50"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      title={variant === 'edit' ? 'Editar' : 'Excluir'}
    >
      {variant === 'edit' ? <FiEdit2 size={16} /> : <FiTrash2 size={16} />}
    </button>
  );
};