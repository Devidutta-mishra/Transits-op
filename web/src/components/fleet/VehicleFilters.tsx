import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface VehicleFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  regionFilter: string;
  onRegionChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  regionFilter,
  onRegionChange,
  sortBy,
  onSortChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 border border-[#2C2C2C] bg-[#111111] select-none font-mono text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH REGISTRATION..."
            className="w-full h-9 pl-9 pr-3 bg-[#0F0F10] border border-[#2C2C2C] text-[11px] text-white placeholder-gray-500 focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] rounded-none uppercase tracking-wider"
          />
        </div>

        <div className="flex flex-col gap-1 text-left">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
          >
            <option value="">ALL STATUSES</option>
            <option value="Available">AVAILABLE</option>
            <option value="On Trip">ON TRIP</option>
            <option value="Maintenance">MAINTENANCE</option>
            <option value="Retired">RETIRED</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 text-left">
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
          >
            <option value="">ALL TYPES</option>
            <option value="HGV">HGV</option>
            <option value="LCV">LCV</option>
            <option value="Trailer">TRAILER</option>
            <option value="Container">CONTAINER</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 text-left">
          <select
            value={regionFilter}
            onChange={(e) => onRegionChange(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
          >
            <option value="">ALL REGIONS</option>
            <option value="West">WEST</option>
            <option value="North">NORTH</option>
            <option value="South">SOUTH</option>
            <option value="East">EAST</option>
          </select>
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-9 flex-1 rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
          >
            <option value="">SORT: DEFAULT</option>
            <option value="registration">REGISTRATION</option>
            <option value="capacity">CAPACITY</option>
            <option value="odometer">ODOMETER</option>
            <option value="cost">COST</option>
          </select>

          <button
            onClick={onReset}
            className="h-9 px-3 bg-[#1C1C20] border border-[#2C2C2C] hover:border-[#D97706] hover:bg-[#111111] transition-colors rounded-none flex items-center justify-center cursor-pointer text-[#A1A1AA] hover:text-white"
            title="Reset Filters"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
