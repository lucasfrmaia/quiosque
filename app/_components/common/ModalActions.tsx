import { FC } from 'react';

interface ModalActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'danger';
}

export const ModalActions: FC<ModalActionsProps> = ({
  onCancel,
  onConfirm,
  confirmLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  confirmVariant = 'primary',
}) => {
  const confirmClasses =
    confirmVariant === 'primary' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="flex justify-end space-x-3 pt-4">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        {cancelLabel}
      </button>
      <button
        onClick={onConfirm}
        className={`px-4 py-2 text-white rounded-lg transition-colors ${confirmClasses}`}
      >
        {confirmLabel}
      </button>
    </div>
  );
};
