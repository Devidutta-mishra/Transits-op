import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { AlertOctagon } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  tripId: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  tripId,
}) => {
  const [reason, setReason] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="max-w-md w-full border border-[#2C2C2C] bg-[#111111] p-6 text-left relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#991B1B]" />

        <div className="flex items-center gap-3 text-[#EF4444] mb-4">
          <AlertOctagon size={20} />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Cancel Operations Manifest
          </h2>
        </div>

        <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed mb-4">
          Are you sure you want to cancel dispatch manifest <span className="font-mono text-white font-bold">{tripId}</span>? The assigned driver and vehicle will be instantly restored to available status.
        </p>

        <div className="flex flex-col gap-1.5 mb-6 font-sans">
          <label className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
            Cancellation Reason (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Mechanical breakdown, client rescheduled consignment..."
            rows={3}
            className="w-full bg-[#0F0F10] border border-[#2C2C2C] p-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D97706] rounded-none resize-none font-sans"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="h-9 text-xs font-mono"
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            className="h-9 text-xs font-mono"
          >
            Cancel Trip
          </Button>
        </div>
      </div>
    </div>
  );
};
