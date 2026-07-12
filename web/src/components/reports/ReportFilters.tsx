import React from 'react';
import type { Vehicle } from '../../mock/vehicles';
import type { Driver } from '../../mock/drivers';
import { RotateCcw } from 'lucide-react';

interface ReportFiltersProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  dateRange: string;
  setDateRange: (val: string) => void;
  selectedVehicle: string;
  setSelectedVehicle: (val: string) => void;
  selectedDriver: string;
  setSelectedDriver: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedFuelType: string;
  setSelectedFuelType: (val: string) => void;
  selectedRegion: string;
  setSelectedRegion: (val: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (val: string) => void;
  onReset: () => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  vehicles,
  drivers,
  dateRange,
  setDateRange,
  selectedVehicle,
  setSelectedVehicle,
  selectedDriver,
  setSelectedDriver,
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  selectedFuelType,
  setSelectedFuelType,
  selectedRegion,
  setSelectedRegion,
  selectedDepartment,
  setSelectedDepartment,
  onReset,
}) => {
  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono text-xs flex flex-col gap-3 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-gray-500 uppercase font-bold">Date Range Filter</label>
          <input
            type="date"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full h-9 px-3 bg-[#0F0F10] border border-[#2C2C2C] text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] rounded-none uppercase tracking-wider font-mono"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-gray-500 uppercase font-bold">Vehicle Fleet</label>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider font-mono"
          >
            <option value="">ALL VEHICLES</option>
            {vehicles.map(v => (
              <option key={v.registrationNumber} value={v.registrationNumber}>
                {v.registrationNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-gray-500 uppercase font-bold">Assigned Driver</label>
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider font-mono"
          >
            <option value="">ALL DRIVERS</option>
            {drivers.map(d => (
              <option key={d.driverId} value={d.driverId}>
                {d.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-gray-500 uppercase font-bold">Trip Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider font-mono"
          >
            <option value="">ALL STATUSES</option>
            <option value="Scheduled">SCHEDULED</option>
            <option value="Active">ACTIVE</option>
            <option value="Completed">COMPLETED</option>
            <option value="Cancelled">CANCELLED</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-gray-500 uppercase font-bold">Expense Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider font-mono"
          >
            <option value="">ALL CATEGORIES</option>
            <option value="Fuel">FUEL</option>
            <option value="Repair">REPAIR</option>
            <option value="Maintenance">MAINTENANCE</option>
            <option value="Insurance">INSURANCE</option>
            <option value="Toll">TOLL</option>
            <option value="Parking">PARKING</option>
            <option value="Tyres">TYRES</option>
            <option value="Registration">REGISTRATION</option>
            <option value="Driver Allowance">DRIVER ALLOWANCE</option>
            <option value="Miscellaneous">MISCELLANEOUS</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-gray-500 uppercase font-bold">Fuel Type</label>
          <select
            value={selectedFuelType}
            onChange={(e) => setSelectedFuelType(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider font-mono"
          >
            <option value="">ALL FUEL TYPES</option>
            <option value="Diesel">DIESEL</option>
            <option value="Petrol">PETROL</option>
            <option value="CNG">CNG</option>
            <option value="Biofuel">BIOFUEL</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-gray-500 uppercase font-bold">Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider font-mono"
          >
            <option value="">ALL REGIONS</option>
            <option value="North">NORTH</option>
            <option value="South">SOUTH</option>
            <option value="East">EAST</option>
            <option value="West">WEST</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-gray-500 uppercase font-bold">Department</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider font-mono"
          >
            <option value="">ALL DEPARTMENTS</option>
            <option value="Operations">OPERATIONS</option>
            <option value="Maintenance">MAINTENANCE</option>
            <option value="Logistics">LOGISTICS</option>
            <option value="Finance">FINANCE</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <button
            onClick={onReset}
            className="h-9 px-3 bg-[#1C1C20] border border-[#2C2C2C] hover:border-[#D97706] hover:bg-[#111111] transition-colors rounded-none flex items-center justify-center cursor-pointer text-[#A1A1AA] hover:text-white uppercase tracking-wider font-mono"
          >
            <RotateCcw size={13} className="mr-2" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
