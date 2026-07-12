import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit2, ShieldAlert, Archive, Trash2, ArrowUpDown } from 'lucide-react';
import type { Driver } from '../../mock/drivers';
import { DriverStatusBadge } from './DriverStatusBadge';
import { LicenseBadge } from './LicenseBadge';
import { cn } from '../../utils/cn';
import type { Role } from '../../types/auth';

interface DriverTableProps {
  drivers: Driver[];
  onView: (driver: Driver) => void;
  onEdit: (driver: Driver) => void;
  onSuspend: (driver: Driver) => void;
  onArchive: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  role: Role;
}

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  onView,
  onEdit,
  onSuspend,
  onArchive,
  onDelete,
  sortField,
  sortDirection,
  onSort,
  role,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleMenu = (driverId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMenuId === driverId) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(driverId);
    }
  };

  React.useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return <ArrowUpDown size={10} className="text-gray-600 ml-1 inline" />;
    return (
      <span className="text-[#D97706] ml-1 font-bold">
        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
      </span>
    );
  };

  const canEdit = role === 'FLEET_MANAGER' || role === 'DISPATCHER' || role === 'SAFETY_OFFICER';
  const canSuspend = role === 'FLEET_MANAGER' || role === 'SAFETY_OFFICER';
  const canArchive = role === 'FLEET_MANAGER' || role === 'SAFETY_OFFICER';
  const canDelete = role === 'FLEET_MANAGER';

  return (
    <div className="w-full border border-[#2C2C2C] bg-[#111111] overflow-x-auto select-none relative max-h-[500px]">
      <table className="w-full text-left font-mono text-xs border-collapse">
        <thead className="sticky top-0 z-10 bg-[#0F0F10] border-b border-[#2C2C2C]">
          <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('id')}>
              Driver ID {renderSortIndicator('id')}
            </th>
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('name')}>
              Driver Name {renderSortIndicator('name')}
            </th>
            <th className="p-3">License Number</th>
            <th className="p-3">Cat</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Email</th>
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('safety')}>
              Safety Score {renderSortIndicator('safety')}
            </th>
            <th className="p-3">Current Vehicle</th>
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('expiry')}>
              License Expiry {renderSortIndicator('expiry')}
            </th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2C2C2C]/50">
          {drivers.map((driver) => (
            <tr key={driver.driverId} className="hover:bg-[#1C1C20] transition-colors">
              <td className="p-3 font-bold text-[#D97706] whitespace-nowrap">
                {driver.driverId}
              </td>
              <td className="p-3 text-white whitespace-nowrap font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border border-zinc-700 bg-zinc-800 flex items-center justify-center text-[10px] text-gray-400 rounded-none font-sans font-bold">
                    {driver.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span>{driver.fullName}</span>
                </div>
              </td>
              <td className="p-3 text-gray-300">{driver.licenseNumber}</td>
              <td className="p-3 text-gray-400">{driver.licenseCategory}</td>
              <td className="p-3 text-gray-300">{driver.phoneNumber}</td>
              <td className="p-3 text-gray-400 font-sans">{driver.email}</td>
              <td className="p-3 text-right pr-8">
                <span
                  className={cn(
                    "font-bold",
                    driver.safetyScore >= 90 ? "text-green-500" : driver.safetyScore >= 70 ? "text-[#D97706]" : "text-red-500"
                  )}
                >
                  {driver.safetyScore}
                </span>
              </td>
              <td className="p-3 text-gray-300 font-bold text-[#D97706]">{driver.assignedVehicle || '-'}</td>
              <td className="p-3 whitespace-nowrap">
                <LicenseBadge expiryDateStr={driver.licenseExpiryDate} />
              </td>
              <td className="p-3 text-center">
                <DriverStatusBadge status={driver.status} />
              </td>
              <td className="p-3 text-right relative">
                <button
                  onClick={(e) => toggleMenu(driver.driverId, e)}
                  className="p-1 hover:bg-[#2C2C2C] text-gray-400 hover:text-white rounded-none cursor-pointer inline-flex items-center"
                >
                  <MoreHorizontal size={14} />
                </button>

                {activeMenuId === driver.driverId && (
                  <div className="absolute right-3 top-10 w-36 bg-[#141416] border border-[#2C2C2C] z-20 flex flex-col font-mono text-[10px] uppercase tracking-wider rounded-none shadow-xl select-none">
                    <button
                      onClick={() => onView(driver)}
                      className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                    >
                      <Eye size={12} className="text-[#D97706]" />
                      <span>View Profile</span>
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => onEdit(driver)}
                        className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                      >
                        <Edit2 size={12} className="text-[#D97706]" />
                        <span>Edit Driver</span>
                      </button>
                    )}
                    {canSuspend && driver.status !== 'Suspended' && (
                      <button
                        onClick={() => onSuspend(driver)}
                        className="flex items-center gap-2 px-3 py-2 text-left text-red-400 hover:bg-[#991B1B]/15 hover:text-red-500 cursor-pointer"
                      >
                        <ShieldAlert size={12} />
                        <span>Suspend</span>
                      </button>
                    )}
                    {canArchive && (
                      <button
                        onClick={() => onArchive(driver)}
                        className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                      >
                        <Archive size={12} className="text-[#D97706]" />
                        <span>Archive</span>
                      </button>
                    )}
                    {canDelete && (
                      <>
                        <div className="border-t border-[#2C2C2C]" />
                        <button
                          onClick={() => onDelete(driver)}
                          className="flex items-center gap-2 px-3 py-2 text-left text-red-400 hover:bg-[#991B1B]/15 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </>
                    )}
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
