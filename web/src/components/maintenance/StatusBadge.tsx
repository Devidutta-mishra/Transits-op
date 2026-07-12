import React from 'react';
import { cn } from '../../utils/cn';
import type { MaintenanceStatus } from '../../mock/maintenance';

interface StatusBadgeProps {
  status: MaintenanceStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider rounded-none border select-none",
        status === 'Scheduled' && "bg-blue-600/10 text-blue-400 border-blue-600/30",
        status === 'In Progress' && "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30",
        status === 'Waiting Parts' && "bg-yellow-600/10 text-yellow-400 border-yellow-600/30",
        status === 'Completed' && "bg-green-600/10 text-green-500 border-green-600/30",
        status === 'Cancelled' && "bg-red-600/10 text-red-500 border-red-600/30",
        status === 'Overdue' && "bg-purple-600/10 text-purple-400 border-purple-600/30"
      )}
    >
      {status}
    </span>
  );
};
