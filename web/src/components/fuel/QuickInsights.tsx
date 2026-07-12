import React from 'react';
import type { FuelLog } from '../../mock/fuel';
import type { ExpenseRecord } from '../../mock/expenses';
import { TrendingUp, TrendingDown, Flame, ShieldAlert } from 'lucide-react';

interface QuickInsightsProps {
  fuelLogs: FuelLog[];
  expenses: ExpenseRecord[];
}

export const QuickInsights: React.FC<QuickInsightsProps> = ({ fuelLogs, expenses: _expenses }) => {
  const vehicleCosts = React.useMemo(() => {
    const mapping: Record<string, number> = {};
    fuelLogs.forEach(l => {
      mapping[l.vehicleReg] = (mapping[l.vehicleReg] || 0) + l.totalCost;
    });
    return mapping;
  }, [fuelLogs]);

  const highestFuelVehicle = React.useMemo(() => {
    let maxCost = 0;
    let maxVeh = 'N/A';
    Object.entries(vehicleCosts).forEach(([veh, cost]) => {
      if (cost > maxCost) {
        maxCost = cost;
        maxVeh = veh;
      }
    });
    return { vehicle: maxVeh, cost: maxCost };
  }, [vehicleCosts]);

  const avgEfficiency = React.useMemo(() => {
    const validLogs = fuelLogs.filter(l => l.fuelEfficiency > 0);
    if (validLogs.length === 0) return 0;
    const sum = validLogs.reduce((acc, curr) => acc + curr.fuelEfficiency, 0);
    return sum / validLogs.length;
  }, [fuelLogs]);

  const fuelTrendPercent = 8.2; 
  const insuranceAlert = "Commercial Vehicle Insurance (DL-3C-EF-5566) is scheduled for renewal next month.";

  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Operational Finance Insights
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Fleet Analytics</span>
      </div>

      <div className="flex flex-col gap-3">
        {highestFuelVehicle.vehicle !== 'N/A' && (
          <div className="flex items-start gap-3 p-2.5 border border-[#2C2C2C]/50 bg-[#0F0F10] hover:border-[#D97706]/20 transition-colors">
            <div className="w-7 h-7 flex items-center justify-center border text-xs shrink-0 text-red-500 bg-red-600/10 border-red-500/20">
              <Flame size={12} />
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-[10px] text-white font-sans font-medium">
                Vehicle <span className="font-mono text-[#D97706] font-bold">{highestFuelVehicle.vehicle}</span> has the highest cumulative fuel consumption.
              </span>
              <span className="text-[8px] text-gray-500 font-mono mt-0.5">
                Total Fuel Cost: ₹{highestFuelVehicle.cost.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-2.5 border border-[#2C2C2C]/50 bg-[#0F0F10] hover:border-[#D97706]/20 transition-colors">
          <div className="w-7 h-7 flex items-center justify-center border text-xs shrink-0 text-[#D97706] bg-[#D97706]/10 border-[#D97706]/20">
            <TrendingUp size={12} />
          </div>
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-[10px] text-white font-sans font-medium">
              Fuel expenses increased by <span className="font-mono font-bold text-[#D97706]">{fuelTrendPercent}%</span> relative to last month.
            </span>
            <span className="text-[8px] text-gray-500 font-mono mt-0.5">
              Influenced by increased dispatch route mileage log counts.
            </span>
          </div>
        </div>

        {avgEfficiency > 0 && (
          <div className="flex items-start gap-3 p-2.5 border border-[#2C2C2C]/50 bg-[#0F0F10] hover:border-[#D97706]/20 transition-colors">
            <div className="w-7 h-7 flex items-center justify-center border text-xs shrink-0 text-green-500 bg-green-600/10 border-green-500/20">
              <TrendingDown size={12} />
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-[10px] text-white font-sans font-medium">
                Average fleet fuel efficiency stabilized at <span className="font-mono text-green-500 font-bold">{avgEfficiency.toFixed(2)} km/L</span>.
              </span>
              <span className="text-[8px] text-gray-500 font-mono mt-0.5">
                Refining preventive maintenance intervals reduced cylinder drags.
              </span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-2.5 border border-[#2C2C2C]/50 bg-[#0F0F10] hover:border-[#D97706]/20 transition-colors">
          <div className="w-7 h-7 flex items-center justify-center border text-xs shrink-0 text-blue-400 bg-blue-600/10 border-blue-600/20">
            <ShieldAlert size={12} />
          </div>
          <div className="flex-1 flex flex-col gap-0.5">
            <span className="text-[10px] text-white font-sans font-medium">
              {insuranceAlert}
            </span>
            <span className="text-[8px] text-gray-500 font-mono mt-0.5">
              Target Renewal Date: 2026-08-10 // Est Cost: ₹32,000.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
