import React from 'react';
import { cn } from '../../utils/cn';
import type { VehicleStatus } from '../../mock/vehicles';

interface VehicleStatusBadgeProps {
  status: VehicleStatus;
}

export const VehicleStatusBadge: React.FC<VehicleStatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider rounded-none border select-none",
        status === 'Available' && "bg-[#16A34A]/10 text-[#22C55E] border-[#16A34A]/30",
        status === 'On Trip' && "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30",
        status === 'Maintenance' && "bg-[#DC2626]/10 text-[#EF4444] border-[#DC2626]/30",
        status === 'Retired' && "bg-zinc-800 text-gray-400 border-zinc-700"
      )}
    >
      {status}
    </span>
  );
};
