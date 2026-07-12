import React from 'react';
import { X, User, Briefcase, FileText, ShieldAlert } from 'lucide-react';
import type { Driver } from '../../mock/drivers';
import { DriverStatusBadge } from './DriverStatusBadge';
import { LicenseBadge } from './LicenseBadge';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface DriverDetailsDrawerProps {
  driver: Driver | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DriverDetailsDrawer: React.FC<DriverDetailsDrawerProps> = ({
  driver,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !driver) return null;

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
            <User size={16} className="text-[#D97706]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              DRIVER RECORD SHEET
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
                {driver.driverId}
              </span>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider font-sans mt-1">
                {driver.fullName}
              </h2>
              <span className="text-xs text-gray-500 font-mono">
                Roster Rank: {driver.licenseCategory} License
              </span>
            </div>
            <DriverStatusBadge status={driver.status} />
          </div>

          <div className="border border-[#2C2C2C] bg-[#0F0F10] h-40 flex flex-col items-center justify-center relative select-none">
            <User size={36} className="text-gray-600 mb-2" />
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              Driver Photo Placeholder
            </span>
            <div className="absolute bottom-2 right-3 font-mono text-[8px] text-gray-600">
              EMP_RECORD_RAW // ID_{driver.driverId}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-[#2C2C2C]/50 pb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Personal Records</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Date of Birth</span>
                <span className="text-white font-medium">{formatDate(driver.dateOfBirth)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Gender</span>
                <span className="text-white font-medium">{driver.gender}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Phone Number</span>
                <span className="text-white font-mono">{driver.phoneNumber}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Email Address</span>
                <span className="text-white font-mono">{driver.email}</span>
              </div>
              <div className="flex flex-col gap-0.5 col-span-2">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Home Address</span>
                <span className="text-white leading-normal">{driver.address}</span>
              </div>
              <div className="flex flex-col gap-0.5 col-span-2">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Emergency Contact Info</span>
                <span className="text-white font-mono">{driver.emergencyContact}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-[#2C2C2C]/50 pb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Compliance & Credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">License Number</span>
                <span className="text-white font-mono">{driver.licenseNumber}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">License Expiry</span>
                <span className="mt-0.5 w-fit">
                  <LicenseBadge expiryDateStr={driver.licenseExpiryDate} />
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Safety Rating</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-zinc-800 h-1.5 border border-zinc-700">
                    <div
                      className={cn(
                        "h-full",
                        driver.safetyScore >= 90 ? "bg-[#16A34A]" : driver.safetyScore >= 70 ? "bg-[#D97706]" : "bg-[#DC2626]"
                      )}
                      style={{ width: `${driver.safetyScore}%` }}
                    />
                  </div>
                  <span className="text-white font-bold font-mono">{driver.safetyScore}/100</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Experience</span>
                <span className="text-white font-mono">{driver.yearsOfExperience} Years</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Joining Date</span>
                <span className="text-white font-mono">{formatDate(driver.joiningDate)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-500 font-mono uppercase">Assigned Vehicle</span>
                <span className="text-white font-mono font-bold text-[#D97706]">{driver.assignedVehicle || 'UNASSIGNED'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#2C2C2C] pt-4">
            <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 rounded-none">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <Briefcase size={12} className="text-gray-500" />
                <span>Recent Trips History</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">
                Dispatched cargo logs, route logs, and trip schedules will be listed here.
              </p>
            </div>

            <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 rounded-none">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <ShieldAlert size={12} className="text-gray-500" />
                <span>Violation & Telematics Log</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">
                Over-speeding notifications, hard braking records, and compliance logs will be listed here.
              </p>
            </div>

            <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 rounded-none">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
                <FileText size={12} className="text-gray-500" />
                <span>Submitted Documents Placeholder</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">
                Scanned PDFs of License copies, background checks, and verification certificates.
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
