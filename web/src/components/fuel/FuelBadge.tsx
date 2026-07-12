import React from 'react';
import { cn } from '../../utils/cn';
import type { FuelType } from '../../mock/fuel';

interface FuelBadgeProps {
  fuelType: FuelType;
}

export const FuelBadge: React.FC<FuelBadgeProps> = ({ fuelType }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider rounded-none border select-none",
        fuelType === 'Diesel' && "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30",
        fuelType === 'Petrol' && "bg-blue-600/10 text-blue-400 border-blue-600/30",
        fuelType === 'CNG' && "bg-green-600/10 text-green-500 border-green-600/30",
        fuelType === 'Biofuel' && "bg-purple-600/10 text-purple-400 border-purple-600/30"
      )}
    >
      {fuelType}
    </span>
  );
};
