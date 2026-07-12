import React, { useState } from 'react';
import { MoreHorizontal, Eye, Trash2, ArrowUpDown } from 'lucide-react';
import type { FuelLog } from '../../mock/fuel';
import type { Driver } from '../../mock/drivers';
import type { Role } from '../../types/auth';
import { FuelBadge } from './FuelBadge';

interface FuelTableProps {
  logs: FuelLog[];
  drivers: Driver[];
  onView: (log: FuelLog) => void;
  onOpenDelete: (log: FuelLog) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  role: Role;
}

export const FuelTable: React.FC<FuelTableProps> = ({
  logs,
  drivers,
  onView,
  onOpenDelete,
  sortField,
  sortDirection,
  onSort,
  role,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleMenu = (logId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMenuId === logId) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(logId);
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return <ArrowUpDown size={10} className="text-gray-600 ml-1 inline" />;
    return (
      <span className="text-[#D97706] ml-1 font-bold">
        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
      </span>
    );
  };

  const canDelete = role === 'FLEET_MANAGER' || role === 'FINANCIAL_ANALYST';

  return (
    <div className="w-full border border-[#2C2C2C] bg-[#111111] overflow-x-auto select-none relative max-h-[500px]">
      <table className="w-full text-left font-mono text-xs border-collapse">
        <thead className="sticky top-0 z-10 bg-[#0F0F10] border-b border-[#2C2C2C]">
          <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('id')}>
              Log ID {renderSortIndicator('id')}
            </th>
            <th className="p-3">Vehicle</th>
            <th className="p-3">Driver Name</th>
            <th className="p-3">Fuel Type</th>
            <th className="p-3 text-right">Qty (L)</th>
            <th className="p-3 text-right">Price/L</th>
            <th className="p-3 text-right cursor-pointer select-none hover:text-white" onClick={() => onSort('cost')}>
              Total Cost {renderSortIndicator('cost')}
            </th>
            <th className="p-3 text-right cursor-pointer select-none hover:text-white" onClick={() => onSort('odometer')}>
              Odometer {renderSortIndicator('odometer')}
            </th>
            <th className="p-3 text-right">Trip Mileage</th>
            <th className="p-3 text-right">Efficiency</th>
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('date')}>
              Date {renderSortIndicator('date')}
            </th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2C2C2C]/50">
          {logs.map((log) => {
            const driver = drivers.find(d => d.driverId === log.driverId);

            return (
              <tr key={log.logId} className="hover:bg-[#1C1C20] transition-colors">
                <td className="p-3 font-bold text-[#D97706] whitespace-nowrap">
                  {log.logId}
                </td>
                <td className="p-3 text-[#D97706] font-bold whitespace-nowrap">{log.vehicleReg}</td>
                <td className="p-3 text-gray-300 font-sans whitespace-nowrap">{driver ? driver.fullName : '-'}</td>
                <td className="p-3">
                  <FuelBadge fuelType={log.fuelType} />
                </td>
                <td className="p-3 text-white text-right pr-4">{log.quantity.toFixed(1)} L</td>
                <td className="p-3 text-white text-right pr-4">₹{log.pricePerLitre.toFixed(2)}</td>
                <td className="p-3 text-white text-right pr-4 font-bold">{formatCost(log.totalCost)}</td>
                <td className="p-3 text-white text-right pr-4 font-mono">{log.currentOdometer.toLocaleString()} km</td>
                <td className="p-3 text-white text-right pr-4">+{log.mileageSinceLastFill.toLocaleString()} km</td>
                <td className="p-3 text-white text-right pr-4 font-mono">{log.fuelEfficiency.toFixed(2)} km/L</td>
                <td className="p-3 text-gray-400 whitespace-nowrap">{formatDate(log.fuelDate)}</td>
                <td className="p-3 text-right relative">
                  <button
                    onClick={(e) => toggleMenu(log.logId, e)}
                    className="p-1 hover:bg-[#2C2C2C] text-gray-400 hover:text-white rounded-none cursor-pointer inline-flex items-center"
                  >
                    <MoreHorizontal size={14} />
                  </button>

                  {activeMenuId === log.logId && (
                    <div className="absolute right-3 top-10 w-36 bg-[#141416] border border-[#2C2C2C] z-20 flex flex-col font-mono text-[10px] uppercase tracking-wider rounded-none shadow-xl select-none">
                      <button
                        onClick={() => onView(log)}
                        className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                      >
                        <Eye size={12} className="text-[#D97706]" />
                        <span>View Details</span>
                      </button>

                      {canDelete && (
                        <>
                          <div className="border-t border-[#2C2C2C]" />
                          <button
                            onClick={() => onOpenDelete(log)}
                            className="flex items-center gap-2 px-3 py-2 text-left text-red-500 hover:bg-[#991B1B]/15 hover:text-red-600 cursor-pointer font-bold"
                          >
                            <Trash2 size={12} />
                            <span>Delete Log</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
