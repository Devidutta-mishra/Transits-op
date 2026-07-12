import React from 'react';
import { cn } from '../../utils/cn';
import type { MaintenancePriority } from '../../mock/maintenance';

interface PriorityBadgeProps {
  priority: MaintenancePriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider rounded-none border select-none",
        priority === 'Low' && "bg-zinc-800 text-gray-400 border-zinc-700",
        priority === 'Medium' && "bg-blue-600/10 text-blue-400 border-blue-600/30",
        priority === 'High' && "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30",
        priority === 'Critical' && "bg-red-600/10 text-red-500 border-red-600/30"
      )}
    >
      {priority}
    </span>
  );
};
