import React from 'react';
import { Button } from '../ui/Button';
import { Trash2 } from 'lucide-react';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  driverName: string;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  driverName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="max-w-md w-full border border-[#2C2C2C] bg-[#111111] p-6 text-left relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#991B1B]" />

        <div className="flex items-center gap-3 text-[#EF4444] mb-4">
          <Trash2 size={20} />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Remove Driver
          </h2>
        </div>

        <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed mb-6">
          Are you sure you want to remove driver <span className="text-white font-bold">{driverName}</span> from the console? This action will remove their payroll profile and active roster records.
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="h-9 text-xs"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="h-9 text-xs"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
