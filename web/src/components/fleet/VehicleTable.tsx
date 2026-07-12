import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit2, Archive, Trash2, Copy, ArrowUpDown } from 'lucide-react';
import type { Vehicle } from '../../mock/vehicles';
import { VehicleStatusBadge } from './VehicleStatusBadge';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onView: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onArchive: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onDuplicate: (vehicle: Vehicle) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  onView,
  onEdit,
  onArchive,
  onDelete,
  onDuplicate,
  sortField,
  sortDirection,
  onSort,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleMenu = (regNum: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMenuId === regNum) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(regNum);
    }
  };

  React.useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const formatCost = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return <ArrowUpDown size={10} className="text-gray-600 ml-1 inline" />;
    return (
      <span className="text-[#D97706] ml-1 font-bold">
        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
      </span>
    );
  };

  return (
    <div className="w-full border border-[#2C2C2C] bg-[#111111] overflow-x-auto select-none relative max-h-[500px]">
      <table className="w-full text-left font-mono text-xs border-collapse">
        <thead className="sticky top-0 z-10 bg-[#0F0F10] border-b border-[#2C2C2C]">
          <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('registration')}>
              Reg Number {renderSortIndicator('registration')}
            </th>
            <th className="p-3">Vehicle Name</th>
            <th className="p-3">Type</th>
            <th className="p-3">Manufacturer</th>
            <th className="p-3">Year</th>
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('capacity')}>
              Capacity (kg) {renderSortIndicator('capacity')}
            </th>
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('odometer')}>
              Odometer (km) {renderSortIndicator('odometer')}
            </th>
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('cost')}>
              Cost {renderSortIndicator('cost')}
            </th>
            <th className="p-3">Driver</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2C2C2C]/50">
          {vehicles.map((vehicle) => (
            <tr key={vehicle.registrationNumber} className="hover:bg-[#1C1C20] transition-colors">
              <td className="p-3 font-bold text-[#D97706] whitespace-nowrap">
                {vehicle.registrationNumber}
              </td>
              <td className="p-3 text-white whitespace-nowrap font-sans">{vehicle.vehicleName}</td>
              <td className="p-3 text-gray-300">{vehicle.vehicleType}</td>
              <td className="p-3 text-gray-300 font-sans">{vehicle.manufacturer}</td>
              <td className="p-3 text-gray-400">{vehicle.modelYear}</td>
              <td className="p-3 text-white text-right pr-6">{vehicle.maxLoadCapacity.toLocaleString()}</td>
              <td className="p-3 text-white text-right pr-6">{vehicle.currentOdometer.toLocaleString()}</td>
              <td className="p-3 text-white whitespace-nowrap text-right pr-6">{formatCost(vehicle.acquisitionCost)}</td>
              <td className="p-3 text-gray-300 font-sans">{vehicle.assignedDriver || '-'}</td>
              <td className="p-3 text-center">
                <VehicleStatusBadge status={vehicle.status} />
              </td>
              <td className="p-3 text-right relative">
                <button
                  onClick={(e) => toggleMenu(vehicle.registrationNumber, e)}
                  className="p-1 hover:bg-[#2C2C2C] text-gray-400 hover:text-white rounded-none cursor-pointer inline-flex items-center"
                >
                  <MoreHorizontal size={14} />
                </button>

                {activeMenuId === vehicle.registrationNumber && (
                  <div className="absolute right-3 top-10 w-36 bg-[#141416] border border-[#2C2C2C] z-20 flex flex-col font-mono text-[10px] uppercase tracking-wider rounded-none shadow-xl select-none">
                    <button
                      onClick={() => onView(vehicle)}
                      className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                    >
                      <Eye size={12} className="text-[#D97706]" />
                      <span>View Specs</span>
                    </button>
                    <button
                      onClick={() => onEdit(vehicle)}
                      className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                    >
                      <Edit2 size={12} className="text-[#D97706]" />
                      <span>Edit Record</span>
                    </button>
                    <button
                      onClick={() => onArchive(vehicle)}
                      disabled={vehicle.status === 'Retired'}
                      className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <Archive size={12} className="text-[#D97706]" />
                      <span>Archive</span>
                    </button>
                    <button
                      onClick={() => onDuplicate(vehicle)}
                      className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                    >
                      <Copy size={12} className="text-[#D97706]" />
                      <span>Duplicate</span>
                    </button>
                    <div className="border-t border-[#2C2C2C]" />
                    <button
                      onClick={() => onDelete(vehicle)}
                      className="flex items-center gap-2 px-3 py-2 text-left text-red-400 hover:bg-[#991B1B]/15 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
