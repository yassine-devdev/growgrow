import React from 'react';
import Modal from '@/components/ui/Modal';
import { Loader2 } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: React.ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
  confirmVariant?: 'primary' | 'destructive';
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirming = false,
  confirmVariant = 'primary',
}) => {
  const confirmClasses = {
    primary: 'bg-brand-primary hover:bg-brand-primary-hover',
    destructive: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="text-sm text-brand-text-alt">{description}</div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md bg-brand-surface-alt hover:bg-brand-border"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white disabled:bg-brand-text-alt ${confirmClasses[confirmVariant]}`}
          >
            {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Dialog;