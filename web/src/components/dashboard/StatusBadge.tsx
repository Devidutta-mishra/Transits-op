import React from 'react';
import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  status: 'Scheduled' | 'In Transit' | 'Completed' | 'Cancelled';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider rounded-none border",
        status === 'Scheduled' && "bg-[#1C1C20] text-gray-300 border-[#2C2C2C]",
        status === 'In Transit' && "bg-[#D97706] text-white border-[#D97706]",
        status === 'Completed' && "bg-[#16A34A] text-white border-[#16A34A]",
        status === 'Cancelled' && "bg-[#DC2626] text-white border-[#DC2626]"
      )}
    >
      {status}
    </span>
  );
};
