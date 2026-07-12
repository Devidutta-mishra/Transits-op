import React from 'react';

interface FuelAnalyticsProps {
  avgMileage: number;
  highestConsumer: string;
  lowestEfficiency: string;
  monthlyConsumption: number;
  avgEfficiency: number;
}

export const FuelAnalytics: React.FC<FuelAnalyticsProps> = ({
  avgMileage,
  highestConsumer,
  lowestEfficiency,
  monthlyConsumption,
  avgEfficiency,
}) => {
  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Fuel & Efficiency Summary
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Fuel Telematics</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Avg Trip Mileage</span>
          <span className="text-white text-base font-bold">{avgMileage.toFixed(0)} km</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Avg Efficiency</span>
          <span className="text-white text-base font-bold">{avgEfficiency.toFixed(2)} km/L</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors col-span-2 sm:col-span-1">
          <span className="text-[9px] text-red-500 uppercase font-bold">Highest Consumer</span>
          <span className="text-red-400 text-sm font-bold truncate" title={highestConsumer}>{highestConsumer}</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors col-span-2 sm:col-span-1">
          <span className="text-[9px] text-red-500 uppercase font-bold">Lowest Efficiency</span>
          <span className="text-red-400 text-sm font-bold truncate" title={lowestEfficiency}>{lowestEfficiency}</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors col-span-2 sm:col-span-1">
          <span className="text-[9px] text-gray-500 uppercase">Monthly Fuel Qty</span>
          <span className="text-[#D97706] text-base font-bold">{monthlyConsumption.toLocaleString()} L</span>
        </div>
      </div>
    </div>
  );
};
