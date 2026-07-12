import React from 'react';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobId: string;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  jobId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="max-w-sm w-full border border-[#2C2C2C] bg-[#111111] p-6 text-left relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#991B1B]" />

        <div className="flex items-center gap-3 text-[#EF4444] mb-4">
          <AlertTriangle size={18} />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">
            DELETE MAINTENANCE MANIFEST
          </h2>
        </div>

        <p className="text-[11px] text-[#A1A1AA] font-sans leading-relaxed mb-6">
          Are you sure you want to permanently delete maintenance job <span className="font-mono text-white font-bold">{jobId}</span>? This action is irreversible.
        </p>

        <div className="flex justify-end gap-3 font-mono text-[10px]">
          <Button
            variant="secondary"
            onClick={onClose}
            className="h-8 text-[10px] uppercase"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="h-8 text-[10px] uppercase"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
