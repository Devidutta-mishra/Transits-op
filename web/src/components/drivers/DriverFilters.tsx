import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface DriverFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  licenseCategoryFilter: string;
  onLicenseCategoryChange: (value: string) => void;
  safetyScoreFilter: string;
  onSafetyScoreChange: (value: string) => void;
  validityFilter: string;
  onValidityChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export const DriverFilters: React.FC<DriverFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  licenseCategoryFilter,
  onLicenseCategoryChange,
  safetyScoreFilter,
  onSafetyScoreChange,
  validityFilter,
  onValidityChange,
  sortBy,
  onSortChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 border border-[#2C2C2C] bg-[#111111] select-none font-mono text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH NAME / ID..."
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
            <option value="Off Duty">OFF DUTY</option>
            <option value="Suspended">SUSPENDED</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 text-left">
          <select
            value={licenseCategoryFilter}
            onChange={(e) => onLicenseCategoryChange(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
          >
            <option value="">ALL LICENSES</option>
            <option value="Heavy">HEAVY</option>
            <option value="Light">LIGHT</option>
            <option value="Hazardous">HAZARDOUS</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 text-left">
          <select
            value={safetyScoreFilter}
            onChange={(e) => onSafetyScoreChange(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
          >
            <option value="">ALL SAFETY RATINGS</option>
            <option value="excellent">EXCELLENT (&gt;90)</option>
            <option value="good">GOOD (70-90)</option>
            <option value="needs_review">REVIEW (&lt;70)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 text-left">
          <select
            value={validityFilter}
            onChange={(e) => onValidityChange(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
          >
            <option value="">ALL VALIDITIES</option>
            <option value="valid">VALID</option>
            <option value="expiring_soon">EXPIRING SOON (&lt;30D)</option>
            <option value="expired">EXPIRED</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 text-left">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
          >
            <option value="">SORT: DEFAULT</option>
            <option value="name">NAME</option>
            <option value="id">DRIVER ID</option>
            <option value="safety">SAFETY SCORE</option>
            <option value="expiry">LICENSE EXPIRY</option>
          </select>
        </div>

        <button
          onClick={onReset}
          className="h-9 px-3 bg-[#1C1C20] border border-[#2C2C2C] hover:border-[#D97706] hover:bg-[#111111] transition-colors rounded-none flex items-center justify-center cursor-pointer text-[#A1A1AA] hover:text-white uppercase tracking-wider"
          title="Reset Filters"
        >
          <RotateCcw size={14} className="mr-2" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
