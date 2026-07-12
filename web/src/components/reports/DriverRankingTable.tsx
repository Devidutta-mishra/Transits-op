import React from 'react';
import type { DriverRank } from '../../mock/reports';

interface DriverRankingTableProps {
  rankings: DriverRank[];
}

export const DriverRankingTable: React.FC<DriverRankingTableProps> = ({ rankings }) => {
  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Top Performing Drivers
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Driver Ranks</span>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="text-[9px] uppercase font-bold text-gray-400 border-b border-[#2C2C2C]">
              <th className="p-2 w-12">Rank</th>
              <th className="p-2">Driver</th>
              <th className="p-2 text-right">Completed Trips</th>
              <th className="p-2 text-right">Safety Score</th>
              <th className="p-2 text-right">Avg Fuel Econ</th>
              <th className="p-2 text-right">On-Time Delivery</th>
              <th className="p-2 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2C2C2C]/30">
            {rankings.map((rank) => (
              <tr key={rank.driverName} className="hover:bg-[#1C1C20] transition-colors">
                <td className="p-2 font-bold text-gray-400">#{rank.rank}</td>
                <td className="p-2 text-white font-sans font-bold whitespace-nowrap">{rank.driverName}</td>
                <td className="p-2 text-right text-white">{rank.completedTrips}</td>
                <td className="p-2 text-right text-green-400 font-bold">{rank.safetyScore}/100</td>
                <td className="p-2 text-right text-white font-mono">{rank.avgFuelEfficiency.toFixed(2)} km/L</td>
                <td className="p-2 text-right text-white">{rank.onTimeDeliveryRate}%</td>
                <td className="p-2 text-right font-bold text-green-500">{rank.performanceScore}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
