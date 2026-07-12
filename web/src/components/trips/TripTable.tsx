import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit2, Play, CheckCircle2, XCircle, Copy, ArrowUpDown, Calendar, Navigation } from 'lucide-react';
import type { Trip } from '../../mock/trips';
import type { Driver } from '../../mock/drivers';
import type { Role } from '../../types/auth';
import { TripStatusBadge } from './TripStatusBadge';

interface TripTableProps {
  trips: Trip[];
  drivers: Driver[];
  onView: (trip: Trip) => void;
  onEdit: (trip: Trip) => void;
  onTransition: (trip: Trip, newStatus: Trip['status']) => void;
  onDuplicate: (trip: Trip) => void;
  onOpenCancel: (trip: Trip) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  role: Role;
}

export const TripTable: React.FC<TripTableProps> = ({
  trips,
  drivers,
  onView,
  onEdit,
  onTransition,
  onDuplicate,
  onOpenCancel,
  sortField,
  sortDirection,
  onSort,
  role,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleMenu = (tripId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMenuId === tripId) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(tripId);
    }
  };

  React.useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const formatCost = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return <ArrowUpDown size={10} className="text-gray-600 ml-1 inline" />;
    return (
      <span className="text-[#D97706] ml-1 font-bold">
        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
      </span>
    );
  };

  const isOperator = role === 'FLEET_MANAGER' || role === 'DISPATCHER';

  return (
    <div className="w-full border border-[#2C2C2C] bg-[#111111] overflow-x-auto select-none relative max-h-[500px]">
      <table className="w-full text-left font-mono text-xs border-collapse">
        <thead className="sticky top-0 z-10 bg-[#0F0F10] border-b border-[#2C2C2C]">
          <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('id')}>
              Trip ID {renderSortIndicator('id')}
            </th>
            <th className="p-3">Route (Origin → Destination)</th>
            <th className="p-3">Vehicle</th>
            <th className="p-3">Driver Name</th>
            <th className="p-3">Weight (kg)</th>
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('distance')}>
              Distance (km) {renderSortIndicator('distance')}
            </th>
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('revenue')}>
              Revenue {renderSortIndicator('revenue')}
            </th>
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('departure')}>
              Departure {renderSortIndicator('departure')}
            </th>
            <th className="p-3">ETA</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2C2C2C]/50">
          {trips.map((trip) => {
            const driver = drivers.find(d => d.driverId === trip.assignedDriver);

            return (
              <tr key={trip.tripId} className="hover:bg-[#1C1C20] transition-colors">
                <td className="p-3 font-bold text-[#D97706] whitespace-nowrap">
                  {trip.tripId}
                </td>
                <td className="p-3 text-white whitespace-nowrap font-sans">
                  {trip.origin} <span className="text-[#D97706] font-mono mx-1">→</span> {trip.destination}
                </td>
                <td className="p-3 text-gray-300 font-bold whitespace-nowrap text-[#D97706]">{trip.assignedVehicle}</td>
                <td className="p-3 text-gray-300 font-sans whitespace-nowrap">{driver ? driver.fullName : '-'}</td>
                <td className="p-3 text-white text-right pr-6">{trip.cargoWeight.toLocaleString()}</td>
                <td className="p-3 text-white text-right pr-6">{trip.plannedDistance.toLocaleString()}</td>
                <td className="p-3 text-white whitespace-nowrap text-right pr-6">{formatCost(trip.revenue)}</td>
                <td className="p-3 text-gray-400 whitespace-nowrap">{formatDate(trip.departureDate)}</td>
                <td className="p-3 text-gray-400 whitespace-nowrap">{formatDate(trip.estimatedArrival)}</td>
                <td className="p-3 text-center">
                  <TripStatusBadge status={trip.status} />
                </td>
                <td className="p-3 text-right relative">
                  <button
                    onClick={(e) => toggleMenu(trip.tripId, e)}
                    className="p-1 hover:bg-[#2C2C2C] text-gray-400 hover:text-white rounded-none cursor-pointer inline-flex items-center"
                  >
                    <MoreHorizontal size={14} />
                  </button>

                  {activeMenuId === trip.tripId && (
                    <div className="absolute right-3 top-10 w-40 bg-[#141416] border border-[#2C2C2C] z-20 flex flex-col font-mono text-[10px] uppercase tracking-wider rounded-none shadow-xl select-none">
                      <button
                        onClick={() => onView(trip)}
                        className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                      >
                        <Eye size={12} className="text-[#D97706]" />
                        <span>View Details</span>
                      </button>

                      {isOperator && (
                        <>
                          <button
                            onClick={() => onEdit(trip)}
                            className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                          >
                            <Edit2 size={12} className="text-[#D97706]" />
                            <span>Edit Manifest</span>
                          </button>

                          {trip.status === 'Draft' && (
                            <button
                              onClick={() => onTransition(trip, 'Scheduled')}
                              className="flex items-center gap-2 px-3 py-2 text-left text-blue-400 hover:bg-[#1C1C20] hover:text-blue-300 cursor-pointer"
                            >
                              <Calendar size={12} />
                              <span>Schedule</span>
                            </button>
                          )}
                          {trip.status === 'Scheduled' && (
                            <button
                              onClick={() => onTransition(trip, 'Dispatched')}
                              className="flex items-center gap-2 px-3 py-2 text-left text-yellow-500 hover:bg-[#1C1C20] hover:text-yellow-400 cursor-pointer"
                            >
                              <Play size={12} />
                              <span>Dispatch</span>
                            </button>
                          )}
                          {trip.status === 'Dispatched' && (
                            <button
                              onClick={() => onTransition(trip, 'In Transit')}
                              className="flex items-center gap-2 px-3 py-2 text-left text-orange-500 hover:bg-[#1C1C20] hover:text-orange-400 cursor-pointer"
                            >
                              <Navigation size={12} />
                              <span>Start Trip</span>
                            </button>
                          )}
                          {trip.status === 'In Transit' && (
                            <button
                              onClick={() => onTransition(trip, 'Completed')}
                              className="flex items-center gap-2 px-3 py-2 text-left text-green-500 hover:bg-[#1C1C20] hover:text-green-400 cursor-pointer"
                            >
                              <CheckCircle2 size={12} />
                              <span>Complete</span>
                            </button>
                          )}

                          <button
                            onClick={() => onDuplicate(trip)}
                            className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                          >
                            <Copy size={12} className="text-[#D97706]" />
                            <span>Duplicate</span>
                          </button>

                          {trip.status !== 'Completed' && trip.status !== 'Cancelled' && (
                            <>
                              <div className="border-t border-[#2C2C2C]" />
                              <button
                                onClick={() => onOpenCancel(trip)}
                                className="flex items-center gap-2 px-3 py-2 text-left text-red-400 hover:bg-[#991B1B]/15 hover:text-red-500 cursor-pointer"
                              >
                                <XCircle size={12} />
                                <span>Cancel Trip</span>
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
