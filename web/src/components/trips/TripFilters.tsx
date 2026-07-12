import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { Vehicle } from '../../mock/vehicles';
import type { Driver } from '../../mock/drivers';

interface TripFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  vehicleFilter: string;
  onVehicleChange: (value: string) => void;
  driverFilter: string;
  onDriverChange: (value: string) => void;
  originFilter: string;
  onOriginChange: (value: string) => void;
  destinationFilter: string;
  onDestinationChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
}

export const TripFilters: React.FC<TripFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  vehicleFilter,
  onVehicleChange,
  driverFilter,
  onDriverChange,
  originFilter,
  onOriginChange,
  destinationFilter,
  onDestinationChange,
  dateFilter,
  onDateChange,
  sortBy,
  onSortChange,
  onReset,
  vehicles,
  drivers,
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
            placeholder="SEARCH TRIP ID..."
            className="w-full h-9 pl-9 pr-3 bg-[#0F0F10] border border-[#2C2C2C] text-[11px] text-white placeholder-gray-500 focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] rounded-none uppercase tracking-wider"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
        >
          <option value="">ALL STATUSES</option>
          <option value="Draft">DRAFT</option>
          <option value="Scheduled">SCHEDULED</option>
          <option value="Dispatched">DISPATCHED</option>
          <option value="In Transit">IN TRANSIT</option>
          <option value="Completed">COMPLETED</option>
          <option value="Cancelled">CANCELLED</option>
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
          value={driverFilter}
          onChange={(e) => onDriverChange(e.target.value)}
          className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
        >
          <option value="">ALL DRIVERS</option>
          {drivers.map(d => (
            <option key={d.driverId} value={d.driverId}>
              {d.fullName}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={originFilter}
          onChange={(e) => onOriginChange(e.target.value)}
          placeholder="ORIGIN YARD..."
          className="w-full h-9 px-3 bg-[#0F0F10] border border-[#2C2C2C] text-[11px] text-white placeholder-gray-500 focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] rounded-none uppercase tracking-wider"
        />

        <input
          type="text"
          value={destinationFilter}
          onChange={(e) => onDestinationChange(e.target.value)}
          placeholder="DESTINATION YARD..."
          className="w-full h-9 px-3 bg-[#0F0F10] border border-[#2C2C2C] text-[11px] text-white placeholder-gray-500 focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] rounded-none uppercase tracking-wider"
        />

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
          <option value="id">TRIP ID</option>
          <option value="departure">DEPARTURE</option>
          <option value="distance">DISTANCE</option>
          <option value="revenue">REVENUE</option>
        </select>

        <button
          onClick={onReset}
          className="h-9 px-3 bg-[#1C1C20] border border-[#2C2C2C] hover:border-[#D97706] hover:bg-[#111111] transition-colors rounded-none flex items-center justify-center cursor-pointer text-[#A1A1AA] hover:text-white uppercase tracking-wider md:col-span-2 lg:col-span-1"
          title="Reset Filters"
        >
          <RotateCcw size={14} className="mr-2" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
