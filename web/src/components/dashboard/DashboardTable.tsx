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
      <table className="w-full text-left font-sans text-xs border-collapse">
        <thead>
          <tr className="bg-[#000000] border-b border-[#333333] text-[10px] uppercase font-bold text-[#A3A3A3] tracking-wider">
            <th className="py-4 px-3">Trip ID</th>
            <th className="py-4 px-3">Vehicle</th>
            <th className="py-4 px-3">Driver</th>
            <th className="py-4 px-3">Origin</th>
            <th className="py-4 px-3">Destination</th>
            <th className="py-4 px-3 text-center">Status</th>
            <th className="py-4 px-3">Departure</th>
            <th className="py-4 px-3">ETA</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#333333]/50">
          {trips.map((trip) => (
            <tr key={trip.id} className="hover:bg-[#222222] transition-colors">
              <td className="py-4 px-3 font-bold text-white font-mono">{trip.id}</td>
              <td className="py-4 px-3 text-white">{trip.vehicle}</td>
              <td className="py-4 px-3 text-white">{trip.driver}</td>
              <td className="py-4 px-3 text-[#A3A3A3]">{trip.origin}</td>
              <td className="py-4 px-3 text-[#A3A3A3]">{trip.destination}</td>
              <td className="py-4 px-3 text-center">
                <StatusBadge status={trip.status} />
              </td>
              <td className="py-4 px-3 text-[#A3A3A3] font-mono">{trip.departureTime}</td>
              <td className="py-4 px-3 text-[#A3A3A3] font-mono">{trip.eta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
