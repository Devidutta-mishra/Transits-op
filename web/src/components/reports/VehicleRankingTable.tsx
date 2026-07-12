import React from 'react';
import type { VehicleRank } from '../../mock/reports';

interface VehicleRankingTableProps {
  rankings: VehicleRank[];
}

export const VehicleRankingTable: React.FC<VehicleRankingTableProps> = ({ rankings }) => {
  const formatCost = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Top Performing Vehicles
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Fleet Ranks</span>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="text-[9px] uppercase font-bold text-gray-400 border-b border-[#2C2C2C]">
              <th className="p-2 w-12">Rank</th>
              <th className="p-2">Vehicle</th>
              <th className="p-2 text-right">Trips</th>
              <th className="p-2 text-right">Revenue</th>
              <th className="p-2 text-right">Fuel Efficiency</th>
              <th className="p-2 text-right">Maint Cost</th>
              <th className="p-2 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2C2C2C]/30">
            {rankings.map((rank) => (
              <tr key={rank.vehicleReg} className="hover:bg-[#1C1C20] transition-colors">
                <td className="p-2 font-bold text-gray-400">#{rank.rank}</td>
                <td className="p-2 text-[#D97706] font-bold whitespace-nowrap">{rank.vehicleReg}</td>
                <td className="p-2 text-right text-white font-bold">{rank.tripsCompleted}</td>
                <td className="p-2 text-right text-white font-bold">{formatCost(rank.revenueGenerated)}</td>
                <td className="p-2 text-right text-white font-mono">{rank.fuelEfficiency.toFixed(2)} km/L</td>
                <td className="p-2 text-right text-red-400">{formatCost(rank.maintenanceCost)}</td>
                <td className="p-2 text-right font-bold text-green-500">{rank.performanceScore}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
