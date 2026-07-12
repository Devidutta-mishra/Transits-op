import React from 'react';
import { X, DollarSign, FileText, ClipboardList } from 'lucide-react';
import type { Trip } from '../../mock/trips';
import type { Vehicle } from '../../mock/vehicles';
import type { Driver } from '../../mock/drivers';
import { TripStatusBadge } from './TripStatusBadge';
import { TripTimeline } from './TripTimeline';
import { Button } from '../ui/Button';

interface TripDetailsDrawerProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
}

export const TripDetailsDrawer: React.FC<TripDetailsDrawerProps> = ({
  trip,
  isOpen,
  onClose,
  vehicles,
  drivers,
}) => {
  if (!isOpen || !trip) return null;

  const vehicle = vehicles.find(v => v.registrationNumber === trip.assignedVehicle);
  const driver = drivers.find(d => d.driverId === trip.assignedDriver);

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
      year: 'numeric',
    });
  };

  const loadPercent = vehicle ? Math.round((trip.cargoWeight / vehicle.maxLoadCapacity) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex justify-end font-sans select-none">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#111111] border-l border-[#2C2C2C] h-screen flex flex-col z-50 text-left">
        <div className="flex items-center justify-between p-4 border-b border-[#2C2C2C] bg-[#0F0F10] font-mono">
          <div className="flex items-center gap-2.5">
            <ClipboardList size={16} className="text-[#D97706]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              DISPATCH SHEET DETAIL
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4 border-b border-[#2C2C2C] pb-4">
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-xs font-bold text-[#D97706] tracking-widest bg-[#D97706]/10 px-2 py-0.5 border border-[#D97706]/20 w-fit">
                {trip.tripId}
              </span>
              <h2 className="text-md font-bold text-white uppercase tracking-wider font-sans mt-1">
                {trip.origin} <span className="text-[#D97706] font-mono mx-1">→</span> {trip.destination}
              </h2>
              <span className="text-[10px] text-gray-500 font-mono">
                Manifest Route Status Verification
              </span>
            </div>
            <TripStatusBadge status={trip.status} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Trip Lifecycle State</span>
            <TripTimeline currentStatus={trip.status} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-[#2C2C2C]/50 pb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Operations Log</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Origin Yard</span>
                <span className="text-white font-medium">{trip.origin}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Destination Yard</span>
                <span className="text-white font-medium">{trip.destination}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Planned Distance</span>
                <span className="text-white font-mono">{trip.plannedDistance.toLocaleString()} km</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Estimated Duration</span>
                <span className="text-white font-mono">{trip.estimatedDuration} Hours</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Departure Date</span>
                <span className="text-white font-mono">{formatDate(trip.departureDate)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">ETA / Scheduled Arrival</span>
                <span className="text-white font-mono">{formatDate(trip.estimatedArrival)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Planned Revenue</span>
                <span className="text-white font-mono">{formatCost(trip.revenue)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Priority Level</span>
                <span className="text-white font-medium">{trip.priority}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-[#2C2C2C]/50 pb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Asset Allocations</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Assigned Driver</span>
                <span className="text-white font-bold">{driver ? driver.fullName : 'UNASSIGNED'}</span>
                {driver && <span className="text-[9px] text-gray-400 font-mono font-semibold">ID: {driver.driverId} // Safety: {driver.safetyScore}/100</span>}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Assigned Vehicle</span>
                <span className="text-white font-bold">{vehicle ? vehicle.vehicleName : 'UNASSIGNED'}</span>
                {vehicle && <span className="text-[9px] text-gray-400 font-mono font-semibold">Reg: {vehicle.registrationNumber} // Type: {vehicle.vehicleType}</span>}
              </div>
              <div className="flex flex-col gap-0.5 col-span-2">
                <span className="text-[10px] text-gray-500 font-mono uppercase font-semibold">Consignment Load margin</span>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex-1 bg-zinc-800 h-2 border border-zinc-700">
                    <div
                      className="bg-[#D97706] h-full"
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                  <span className="text-white font-mono font-bold text-xs">{trip.cargoWeight.toLocaleString()} / {vehicle ? vehicle.maxLoadCapacity.toLocaleString() : 0} kg ({loadPercent}%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#2C2C2C] pt-4">
            <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 rounded-none">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <ClipboardList size={12} className="text-gray-500" />
                <span>Dispatch Log History</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">
                Departure weighbridge clearances, driver check-in times, and checklist submissions.
              </p>
            </div>

            <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 rounded-none">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <DollarSign size={12} className="text-gray-500" />
                <span>Consolidated Fuel Slips</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">
                Refueling receipts, fleet card transaction logs, and average fuel economy figures.
              </p>
            </div>

            {trip.notes && (
              <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 rounded-none">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                  <FileText size={12} className="text-gray-500" />
                  <span>Operations Manager Notes</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-normal font-sans">
                  {trip.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-[#2C2C2C] bg-[#0F0F10] flex justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            className="h-9 text-xs uppercase"
          >
            Close Sheet
          </Button>
        </div>
      </div>
    </div>
  );
};
