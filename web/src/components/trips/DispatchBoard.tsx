import React from 'react';
import type { Trip } from '../../mock/trips';
import type { Vehicle } from '../../mock/vehicles';
import type { Driver } from '../../mock/drivers';
import type { Role } from '../../types/auth';
import { ProgressBar } from './ProgressBar';
import { TripStatusBadge } from './TripStatusBadge';
import { MapPin, Navigation, Check, X } from 'lucide-react';

interface DispatchBoardProps {
  activeTrips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onReassignDriver: (tripId: string, driverId: string) => void;
  onReassignVehicle: (tripId: string, regNumber: string) => void;
  onComplete: (trip: Trip) => void;
  onCancel: (trip: Trip) => void;
  onDuplicate: (trip: Trip) => void;
  role: Role;
}

export const DispatchBoard: React.FC<DispatchBoardProps> = ({
  activeTrips,
  vehicles,
  drivers,
  onReassignDriver,
  onReassignVehicle,
  onComplete,
  onCancel,
  onDuplicate,
  role,
}) => {
  const isOperator = role === 'FLEET_MANAGER' || role === 'DISPATCHER';

  return (
    <div className="flex flex-col gap-4 text-left font-sans select-none">
      <div className="flex items-center gap-2 border-b border-[#2C2C2C] pb-2">
        <Navigation size={16} className="text-[#D97706]" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Live Dispatch Board
        </h2>
        <span className="text-[10px] text-gray-500 font-mono">
          ({activeTrips.length} ACTIVE TRANSPORTS)
        </span>
      </div>

      {activeTrips.length === 0 ? (
        <div className="border border-[#2C2C2C] border-dashed p-8 text-center text-xs text-gray-500 font-mono">
          NO DISPATCHED CONSIGNMENTS ARE CURRENTLY EN ROUTE.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeTrips.map(trip => {
            const currentDriver = drivers.find(d => d.driverId === trip.assignedDriver);

            const availableDrivers = drivers.filter(d => 
              (d.status === 'Available' && new Date(d.licenseExpiryDate) > new Date('2026-07-12')) || 
              d.driverId === trip.assignedDriver
            );

            const availableVehicles = vehicles.filter(v => 
              v.status === 'Available' || 
              v.registrationNumber === trip.assignedVehicle
            );

            return (
              <div key={trip.tripId} className="border border-[#2C2C2C] bg-[#111111] p-4 flex flex-col gap-4 relative rounded-none hover:border-[#D97706]/40 transition-colors">
                <div className="flex items-start justify-between font-mono text-[10px] border-b border-[#2C2C2C] pb-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#D97706] font-bold">{trip.tripId}</span>
                    <span className="text-gray-500 text-[9px]">ETA: {new Date(trip.estimatedArrival).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <TripStatusBadge status={trip.status} />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <MapPin size={12} className="text-gray-500" />
                    <span>{trip.origin}</span>
                    <span className="text-[#D97706] font-mono mx-1">→</span>
                    <span>{trip.destination}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center justify-between text-[9px] text-gray-500 font-mono">
                      <span>Consignment Progress</span>
                      <span className="text-white font-bold">{trip.progress}%</span>
                    </div>
                    <ProgressBar progress={trip.progress} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px] border-t border-[#2C2C2C]/50 pt-2 font-mono">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-[9px] uppercase">Vehicle Code</span>
                    {isOperator ? (
                      <select
                        value={trip.assignedVehicle}
                        onChange={(e) => onReassignVehicle(trip.tripId, e.target.value)}
                        className="bg-[#0F0F10] border border-[#2C2C2C] text-white px-2 py-1 rounded-none focus:outline-none focus:border-[#D97706] cursor-pointer w-full text-[10px]"
                      >
                        {availableVehicles.map(v => (
                          <option key={v.registrationNumber} value={v.registrationNumber}>
                            {v.registrationNumber}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-white font-bold">{trip.assignedVehicle}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-[9px] uppercase">Roster Driver</span>
                    {isOperator ? (
                      <select
                        value={trip.assignedDriver}
                        onChange={(e) => onReassignDriver(trip.tripId, e.target.value)}
                        className="bg-[#0F0F10] border border-[#2C2C2C] text-white px-2 py-1 rounded-none focus:outline-none focus:border-[#D97706] cursor-pointer w-full text-[10px]"
                      >
                        {availableDrivers.map(d => (
                          <option key={d.driverId} value={d.driverId}>
                            {d.fullName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-white font-bold">{currentDriver ? currentDriver.fullName : '-'}</span>
                    )}
                  </div>
                </div>

                {isOperator && (
                  <div className="flex gap-2 border-t border-[#2C2C2C]/50 pt-3 mt-auto font-mono text-[9px]">
                    <button
                      onClick={() => onComplete(trip)}
                      className="flex-1 h-8 bg-green-600/10 border border-green-600/30 hover:bg-green-600 hover:text-white transition-colors text-green-500 font-semibold uppercase rounded-none cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check size={11} />
                      <span>Complete</span>
                    </button>
                    <button
                      onClick={() => onDuplicate(trip)}
                      className="h-8 px-2 bg-zinc-800 border border-zinc-700 hover:border-[#D97706] hover:text-white transition-colors text-gray-300 font-semibold uppercase rounded-none cursor-pointer flex items-center justify-center"
                      title="Duplicate Trip"
                    >
                      <span>Dup</span>
                    </button>
                    <button
                      onClick={() => onCancel(trip)}
                      className="flex-1 h-8 bg-red-600/10 border border-red-600/30 hover:bg-red-600 hover:text-white transition-colors text-red-500 font-semibold uppercase rounded-none cursor-pointer flex items-center justify-center gap-1"
                    >
                      <X size={11} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
