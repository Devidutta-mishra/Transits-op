import React from 'react';
import { X, Fuel, MapPin, ClipboardList, Wallet } from 'lucide-react';
import type { FuelLog } from '../../mock/fuel';
import type { Vehicle } from '../../mock/vehicles';
import type { Driver } from '../../mock/drivers';
import { FuelBadge } from './FuelBadge';
import { Button } from '../ui/Button';

interface FuelDrawerProps {
  log: FuelLog | null;
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
}

export const FuelDrawer: React.FC<FuelDrawerProps> = ({
  log,
  isOpen,
  onClose,
  vehicles,
  drivers,
}) => {
  if (!isOpen || !log) return null;

  const vehicle = vehicles.find(v => v.registrationNumber === log.vehicleReg);
  const driver = drivers.find(d => d.driverId === log.driverId);

  const formatCost = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
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

      <div className="relative w-full max-w-md bg-[#111111] border-l border-[#2C2C2C] h-screen flex flex-col z-50 text-left">
        <div className="flex items-center justify-between p-4 border-b border-[#2C2C2C] bg-[#0F0F10] font-mono">
          <div className="flex items-center gap-2.5">
            <Fuel size={16} className="text-[#D97706]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              FUEL SHEET DETAIL
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
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs font-bold text-[#D97706] tracking-widest bg-[#D97706]/10 px-2 py-0.5 border border-[#D97706]/20 w-fit">
                {log.logId}
              </span>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-sans mt-1">
                Refueling transaction // {log.vehicleReg}
              </h2>
              <span className="text-[10px] text-gray-500 font-mono">
                {vehicle ? `${vehicle.vehicleName} (${vehicle.vehicleType})` : 'Vehicle Manifest Detail'}
              </span>
            </div>
            <FuelBadge fuelType={log.fuelType} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-[#2C2C2C]/50 pb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Refueling Logs</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-gray-500 font-mono uppercase">Driver Roster</span>
                <span className="text-white font-semibold">{driver ? driver.fullName : '-'}</span>
                <span className="text-[8px] text-gray-500 font-mono">{log.driverId}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-gray-500 font-mono uppercase">Fuel Date</span>
                <span className="text-white font-semibold">{formatDate(log.fuelDate)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-gray-500 font-mono uppercase">Fuel Quantity</span>
                <span className="text-white font-mono">{log.quantity.toFixed(1)} L</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-gray-500 font-mono uppercase">Price per Litre</span>
                <span className="text-white font-mono">₹{log.pricePerLitre.toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-0.5 col-span-2 border-t border-[#2C2C2C]/30 pt-2 mt-1">
                <span className="text-[9px] text-gray-500 font-mono uppercase">Total Paid cost</span>
                <span className="text-white font-mono text-base font-bold">{formatCost(log.totalCost)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-[#2C2C2C]/50 pb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Metrics & Efficiencies</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-gray-500 font-mono uppercase">Current Odometer</span>
                <span className="text-white font-mono font-semibold">{log.currentOdometer.toLocaleString()} km</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-gray-500 font-mono uppercase">Mileage Since Last Fill</span>
                <span className="text-white font-mono font-semibold">+{log.mileageSinceLastFill.toLocaleString()} km</span>
              </div>
              <div className="flex flex-col gap-0.5 col-span-2">
                <span className="text-[9px] text-gray-500 font-mono uppercase">Calculated Fuel Efficiency</span>
                <span className="text-[#D97706] font-mono text-sm font-bold mt-0.5">{log.fuelEfficiency.toFixed(2)} km/L</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#2C2C2C] pt-4">
            <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 rounded-none">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <MapPin size={12} className="text-gray-500" />
                <span>Fuel Station Station Location</span>
              </div>
              <p className="text-xs text-gray-300 font-mono font-bold">
                {log.fuelStation.toUpperCase()}
              </p>
            </div>

            <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 rounded-none">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <Wallet size={12} className="text-gray-500" />
                <span>Receipt Clearance Details</span>
              </div>
              <div className="flex flex-col gap-1 text-[10px] font-mono text-gray-400">
                <div className="flex justify-between">
                  <span>RECEIPT NO:</span>
                  <span className="text-white font-bold">{log.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>PAY METHOD:</span>
                  <span className="text-white font-bold">{log.paymentMethod.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {log.remarks && (
              <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 rounded-none">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                  <ClipboardList size={12} className="text-gray-500" />
                  <span>Log Remarks</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-normal font-sans">
                  {log.remarks}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-[#2C2C2C] bg-[#0F0F10] flex justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            className="h-9 text-xs uppercase font-mono"
          >
            Close Sheet
          </Button>
        </div>
      </div>
    </div>
  );
};
