import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit2, CheckCircle2, XCircle, Trash2, Archive, ArrowUpDown } from 'lucide-react';
import type { MaintenanceJob } from '../../mock/maintenance';
import type { Role } from '../../types/auth';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';

interface MaintenanceTableProps {
  jobs: MaintenanceJob[];
  onView: (job: MaintenanceJob) => void;
  onEdit: (job: MaintenanceJob) => void;
  onComplete: (job: MaintenanceJob) => void;
  onCancel: (job: MaintenanceJob) => void;
  onArchive: (job: MaintenanceJob) => void;
  onOpenDelete: (job: MaintenanceJob) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  role: Role;
}

export const MaintenanceTable: React.FC<MaintenanceTableProps> = ({
  jobs,
  onView,
  onEdit,
  onComplete,
  onCancel,
  onArchive,
  onOpenDelete,
  sortField,
  sortDirection,
  onSort,
  role,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleMenu = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMenuId === jobId) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(jobId);
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

  const canModify = role === 'FLEET_MANAGER' || role === 'SAFETY_OFFICER';

  return (
    <div className="w-full border border-[#2C2C2C] bg-[#111111] overflow-x-auto select-none relative max-h-[500px]">
      <table className="w-full text-left font-mono text-xs border-collapse">
        <thead className="sticky top-0 z-10 bg-[#0F0F10] border-b border-[#2C2C2C]">
          <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('id')}>
              Job ID {renderSortIndicator('id')}
            </th>
            <th className="p-3">Vehicle</th>
            <th className="p-3">Service Type</th>
            <th className="p-3">Priority</th>
            <th className="p-3">Mechanic</th>
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('date')}>
              Sched Date {renderSortIndicator('date')}
            </th>
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('cost')}>
              Est Cost {renderSortIndicator('cost')}
            </th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2C2C2C]/50">
          {jobs.map((job) => (
            <tr key={job.jobId} className="hover:bg-[#1C1C20] transition-colors">
              <td className="p-3 font-bold text-[#D97706] whitespace-nowrap">
                {job.jobId}
              </td>
              <td className="p-3 text-[#D97706] font-bold whitespace-nowrap">{job.vehicleReg}</td>
              <td className="p-3 text-white whitespace-nowrap font-sans">{job.maintenanceType}</td>
              <td className="p-3">
                <PriorityBadge priority={job.priority} />
              </td>
              <td className="p-3 text-gray-300 font-sans whitespace-nowrap">{job.assignedMechanic}</td>
              <td className="p-3 text-gray-400 whitespace-nowrap">{formatDate(job.scheduledDate)}</td>
              <td className="p-3 text-white text-right pr-6 whitespace-nowrap">{formatCost(job.estimatedCost)}</td>
              <td className="p-3 text-center">
                <StatusBadge status={job.status} />
              </td>
              <td className="p-3 text-right relative">
                <button
                  onClick={(e) => toggleMenu(job.jobId, e)}
                  className="p-1 hover:bg-[#2C2C2C] text-gray-400 hover:text-white rounded-none cursor-pointer inline-flex items-center"
                >
                  <MoreHorizontal size={14} />
                </button>

                {activeMenuId === job.jobId && (
                  <div className="absolute right-3 top-10 w-40 bg-[#141416] border border-[#2C2C2C] z-20 flex flex-col font-mono text-[10px] uppercase tracking-wider rounded-none shadow-xl select-none">
                    <button
                      onClick={() => onView(job)}
                      className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                    >
                      <Eye size={12} className="text-[#D97706]" />
                      <span>View Details</span>
                    </button>

                    {canModify && (
                      <>
                        <button
                          onClick={() => onEdit(job)}
                          className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                        >
                          <Edit2 size={12} className="text-[#D97706]" />
                          <span>Edit Job</span>
                        </button>

                        {job.status !== 'Completed' && job.status !== 'Cancelled' && (
                          <>
                            <button
                              onClick={() => onComplete(job)}
                              className="flex items-center gap-2 px-3 py-2 text-left text-green-500 hover:bg-[#1C1C20] hover:text-green-400 cursor-pointer"
                            >
                              <CheckCircle2 size={12} />
                              <span>Complete</span>
                            </button>
                            <button
                              onClick={() => onCancel(job)}
                              className="flex items-center gap-2 px-3 py-2 text-left text-red-400 hover:bg-[#991B1B]/15 hover:text-red-500 cursor-pointer"
                            >
                              <XCircle size={12} />
                              <span>Cancel Job</span>
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => onArchive(job)}
                          className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                        >
                          <Archive size={12} className="text-[#D97706]" />
                          <span>Archive Record</span>
                        </button>

                        <div className="border-t border-[#2C2C2C]" />
                        <button
                          onClick={() => onOpenDelete(job)}
                          className="flex items-center gap-2 px-3 py-2 text-left text-red-500 hover:bg-[#991B1B]/15 hover:text-red-600 cursor-pointer font-bold"
                        >
                          <Trash2 size={12} />
                          <span>Delete Job</span>
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
