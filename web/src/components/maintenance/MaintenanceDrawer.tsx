import React from 'react';
import { X, Wrench, ClipboardList, ShieldAlert, Package } from 'lucide-react';
import type { MaintenanceJob } from '../../mock/maintenance';
import type { Vehicle } from '../../mock/vehicles';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { MaintenanceTimeline } from './MaintenanceTimeline';
import { Button } from '../ui/Button';

interface MaintenanceDrawerProps {
  job: MaintenanceJob | null;
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
}

export const MaintenanceDrawer: React.FC<MaintenanceDrawerProps> = ({
  job,
  isOpen,
  onClose,
  vehicles,
}) => {
  if (!isOpen || !job) return null;

  const vehicle = vehicles.find(v => v.registrationNumber === job.vehicleReg);

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
            <Wrench size={16} className="text-[#D97706]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              MAINTENANCE SHEET DETAIL
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
                {job.jobId}
              </span>
              <h2 className="text-md font-bold text-white uppercase tracking-wider font-sans mt-1">
                {job.maintenanceType} <span className="text-[#D97706] font-mono mx-1">//</span> {job.vehicleReg}
              </h2>
              <span className="text-[10px] text-gray-500 font-mono font-semibold">
                {vehicle ? `${vehicle.vehicleName} (${vehicle.vehicleType})` : 'Vehicle Manifest Detail'}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <StatusBadge status={job.status} />
              <PriorityBadge priority={job.priority} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Service Timeline</span>
              <MaintenanceTimeline currentStatus={job.status} />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 border-b border-[#2C2C2C]/50 pb-2">
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Assigned Tech</span>
                <span className="text-white text-xs font-bold font-mono">{job.assignedMechanic.toUpperCase()}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Costs Summary</span>
                <div className="flex flex-col gap-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>ESTIMATED:</span>
                    <span className="text-white">{formatCost(job.estimatedCost)}</span>
                  </div>
                  {job.actualCost && (
                    <div className="flex items-center justify-between text-gray-400 border-t border-[#2C2C2C]/50 pt-1 mt-0.5">
                      <span>ACTUAL COST:</span>
                      <span className="text-[#D97706] font-bold">{formatCost(job.actualCost)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Schedule Dates</span>
                <div className="flex flex-col gap-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>PLANNED:</span>
                    <span className="text-white">{formatDate(job.scheduledDate)}</span>
                  </div>
                  {job.completionDate && (
                    <div className="flex items-center justify-between text-gray-400">
                      <span>COMPLETED:</span>
                      <span className="text-green-500">{formatDate(job.completionDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-[#2C2C2C]/50 pb-1">
              Job Description
            </span>
            <p className="text-xs text-gray-300 font-sans leading-relaxed font-normal">
              {job.description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-[#2C2C2C]/50 pb-1">
              Required Parts Inventory
            </span>
            {job.requiredParts.length === 0 ? (
              <span className="text-[10px] text-gray-500 font-mono">NO REPAIR PARTS REQUESTED.</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {job.requiredParts.map(part => (
                  <span
                    key={part}
                    className="inline-flex items-center gap-1 px-2 py-0.5 border border-[#2C2C2C] bg-[#0F0F10] text-[9px] font-mono text-gray-400 select-none rounded-none"
                  >
                    <Package size={10} className="text-gray-600" />
                    <span>{part.toUpperCase()}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-[#2C2C2C] pt-4">
            <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 rounded-none">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <ClipboardList size={12} className="text-gray-500" />
                <span>Job Checklist Protocol</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">
                Standard diagnostic procedures, safety bushing inspect points, and tire rotation alignments.
              </p>
            </div>

            <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 rounded-none">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <ShieldAlert size={12} className="text-gray-500" />
                <span>Quality Check Clearances</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">
                Sign-off logs from fleet safety inspectors and mechanical road-testing checklist sheets.
              </p>
            </div>
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
