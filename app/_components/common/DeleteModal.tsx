import { FC } from 'react';
import { Modal } from '../Modal';
import { ModalActions } from './ModalActions';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
}

export const DeleteModal: FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Excluir ${itemType}`}>
      <div className="space-y-4">
        <p className="text-gray-600">
          Tem certeza que deseja excluir {itemType.toLowerCase()} &quot;{itemName}&quot;? Esta ação
          não pode ser desfeita.
        </p>
        <ModalActions
          onCancel={onClose}
          onConfirm={onConfirm}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          confirmVariant="danger"
        />
      </div>
    </Modal>
  );
};
