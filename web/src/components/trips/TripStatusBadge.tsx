import React from 'react';
import { cn } from '../../utils/cn';
import type { TripStatus } from '../../mock/trips';

interface TripStatusBadgeProps {
  status: TripStatus;
}

export const TripStatusBadge: React.FC<TripStatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider rounded-none border select-none",
        status === 'Draft' && "bg-zinc-800 text-gray-400 border-zinc-700",
        status === 'Scheduled' && "bg-blue-600/10 text-blue-400 border-blue-600/30",
        status === 'Dispatched' && "bg-yellow-600/10 text-[#D97706] border-yellow-600/30",
        status === 'In Transit' && "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30",
        status === 'Completed' && "bg-green-600/10 text-green-500 border-green-600/30",
        status === 'Cancelled' && "bg-red-600/10 text-red-500 border-red-600/30"
      )}
    >
      {status}
    </span>
  );
};
