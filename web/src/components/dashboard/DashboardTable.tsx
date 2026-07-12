import React from 'react';
import type { MockTrip } from '../../mock/dashboard';
import { StatusBadge } from './StatusBadge';
import { EmptyState } from './EmptyState';

interface DashboardTableProps {
  trips: MockTrip[];
}

export const DashboardTable: React.FC<DashboardTableProps> = ({ trips }) => {
  if (trips.length === 0) {
    return (
      <EmptyState 
        title="No Trips Today" 
        description="There are no active or scheduled trips registered for the current operational shift." 
      />
    );
  }

  return (
    <div className="w-full border border-[#2C2C2C] bg-[#111111] overflow-x-auto select-none">
      <table className="w-full text-left font-mono text-xs border-collapse">
        <thead>
          <tr className="bg-[#0F0F10] border-b border-[#2C2C2C] text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            <th className="p-3">Trip ID</th>
            <th className="p-3">Vehicle</th>
            <th className="p-3">Driver</th>
            <th className="p-3">Origin</th>
            <th className="p-3">Destination</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3">Departure</th>
            <th className="p-3">ETA</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2C2C2C]/50">
          {trips.map((trip) => (
            <tr key={trip.id} className="hover:bg-[#1C1C20] transition-colors">
              <td className="p-3 font-bold text-[#D97706]">{trip.id}</td>
              <td className="p-3 text-white">{trip.vehicle}</td>
              <td className="p-3 text-white font-sans">{trip.driver}</td>
              <td className="p-3 text-gray-300 font-sans">{trip.origin}</td>
              <td className="p-3 text-gray-300 font-sans">{trip.destination}</td>
              <td className="p-3 text-center">
                <StatusBadge status={trip.status} />
              </td>
              <td className="p-3 text-gray-400">{trip.departureTime}</td>
              <td className="p-3 text-gray-400">{trip.eta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
