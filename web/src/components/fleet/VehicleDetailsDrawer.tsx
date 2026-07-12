import React from 'react';
import { X, Truck, Wrench, Calendar } from 'lucide-react';
import type { Vehicle } from '../../mock/vehicles';
import { VehicleStatusBadge } from './VehicleStatusBadge';
import { Button } from '../ui/Button';

interface VehicleDetailsDrawerProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VehicleDetailsDrawer: React.FC<VehicleDetailsDrawerProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !vehicle) return null;

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

  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex justify-end font-sans select-none">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#111111] border-l border-[#2C2C2C] h-screen flex flex-col z-50 text-left">
        <div className="flex items-center justify-between p-4 border-b border-[#2C2C2C] bg-[#0F0F10] font-mono">
          <div className="flex items-center gap-2.5">
            <Truck size={16} className="text-[#D97706]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              VEHICLE RECORD SHEET
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
                {vehicle.registrationNumber}
              </span>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider font-sans mt-1">
                {vehicle.vehicleName}
              </h2>
              <span className="text-xs text-gray-500 font-mono">
                VIN: {vehicle.vinNumber}
              </span>
            </div>
            <VehicleStatusBadge status={vehicle.status} />
          </div>

          <div className="border border-[#2C2C2C] bg-[#0F0F10] h-40 flex flex-col items-center justify-center relative select-none">
            <Truck size={36} className="text-gray-600 mb-2" />
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              Asset Photo Placeholder
            </span>
            <div className="absolute bottom-2 right-3 font-mono text-[8px] text-gray-600">
              SPEC_RESOLVE // 400x160_RAW
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-[#2C2C2C]/50 pb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Specifications</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Manufacturer</span>
                <span className="text-white font-medium">{vehicle.manufacturer}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Model / Year</span>
                <span className="text-white font-medium">{vehicle.model} ({vehicle.modelYear})</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Vehicle Type</span>
                <span className="text-white font-medium">{vehicle.vehicleType}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Fuel Type</span>
                <span className="text-white font-medium">{vehicle.fuelType}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Load Capacity</span>
                <span className="text-white font-mono">{vehicle.maxLoadCapacity.toLocaleString()} kg</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Odometer</span>
                <span className="text-white font-mono">{vehicle.currentOdometer.toLocaleString()} km</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Acquisition Cost</span>
                <span className="text-white font-mono">{formatCost(vehicle.acquisitionCost)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Operational Region</span>
                <span className="text-white font-medium">{vehicle.region}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-[#2C2C2C]/50 pb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Compliance & Administration</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Engine Number</span>
                <span className="text-white font-mono">{vehicle.engineNumber}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Purchase Date</span>
                <span className="text-white font-mono">{formatDate(vehicle.purchaseDate)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Insurance Expiry</span>
                <span className="text-white font-mono">{formatDate(vehicle.insuranceExpiry)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Registration Expiry</span>
                <span className="text-white font-mono">{formatDate(vehicle.registrationExpiry)}</span>
              </div>
              <div className="flex flex-col gap-0.5 col-span-2">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Assigned Driver</span>
                <span className="text-white font-sans">{vehicle.assignedDriver || 'UNASSIGNED'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#2C2C2C] pt-4">
            <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 rounded-none">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <Wrench size={12} className="text-gray-500" />
                <span>Maintenance History Placeholder</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">
                Inspection schedules and workshop work orders logs will be listed here.
              </p>
            </div>

            <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 rounded-none">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <Calendar size={12} className="text-gray-500" />
                <span>Trip History Placeholder</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">
                Dispatched cargo manifests, trip timings, and mileage trends will be listed here.
              </p>
            </div>
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
