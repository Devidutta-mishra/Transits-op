import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { Vehicle } from '../../mock/vehicles';

interface MaintenanceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  vehicleFilter: string;
  onVehicleChange: (value: string) => void;
  priorityFilter: string;
  onPriorityChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  mechanicFilter: string;
  onMechanicChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
  vehicles: Vehicle[];
  mechanics: string[];
}

export const MaintenanceFilters: React.FC<MaintenanceFiltersProps> = ({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeChange,
  vehicleFilter,
  onVehicleChange,
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
  mechanicFilter,
  onMechanicChange,
  dateFilter,
  onDateChange,
  sortBy,
  onSortChange,
  onReset,
  vehicles,
  mechanics,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 border border-[#2C2C2C] bg-[#111111] select-none font-mono text-xs text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH JOB ID..."
            className="w-full h-9 pl-9 pr-3 bg-[#0F0F10] border border-[#2C2C2C] text-[11px] text-white placeholder-gray-500 focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] rounded-none uppercase tracking-wider"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
        >
          <option value="">ALL SERVICE TYPES</option>
          <option value="Preventive">PREVENTIVE</option>
          <option value="Corrective">CORRECTIVE</option>
          <option value="Breakdown">BREAKDOWN</option>
          <option value="Inspection">INSPECTION</option>
          <option value="Oil Change">OIL CHANGE</option>
          <option value="Tyre Replacement">TYRE REPLACEMENT</option>
          <option value="Brake Service">BRAKE SERVICE</option>
        </select>

        <select
          value={vehicleFilter}
          onChange={(e) => onVehicleChange(e.target.value)}
          className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
        >
          <option value="">ALL VEHICLES</option>
          {vehicles.map(v => (
            <option key={v.registrationNumber} value={v.registrationNumber}>
              {v.registrationNumber}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
        >
          <option value="">ALL PRIORITIES</option>
          <option value="Low">LOW</option>
          <option value="Medium">MEDIUM</option>
          <option value="High">HIGH</option>
          <option value="Critical">CRITICAL</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
        >
          <option value="">ALL STATUSES</option>
          <option value="Scheduled">SCHEDULED</option>
          <option value="In Progress">IN PROGRESS</option>
          <option value="Waiting Parts">WAITING PARTS</option>
          <option value="Completed">COMPLETED</option>
          <option value="Cancelled">CANCELLED</option>
          <option value="Overdue">OVERDUE</option>
        </select>

        <select
          value={mechanicFilter}
          onChange={(e) => onMechanicChange(e.target.value)}
          className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
        >
          <option value="">ALL MECHANICS</option>
          {mechanics.map(m => (
            <option key={m} value={m}>
              {m.toUpperCase()}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full h-9 px-3 bg-[#0F0F10] border border-[#2C2C2C] text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] rounded-none uppercase tracking-wider"
        />

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
        >
          <option value="">SORT: DEFAULT</option>
          <option value="id">JOB ID</option>
          <option value="date">SCHEDULED DATE</option>
          <option value="cost">ESTIMATED COST</option>
        </select>

        <button
          onClick={onReset}
          className="h-9 px-3 bg-[#1C1C20] border border-[#2C2C2C] hover:border-[#D97706] hover:bg-[#111111] transition-colors rounded-none flex items-center justify-center cursor-pointer text-[#A1A1AA] hover:text-white uppercase tracking-wider sm:col-span-2 lg:col-span-1"
          title="Reset Filters"
        >
          <RotateCcw size={14} className="mr-2" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
