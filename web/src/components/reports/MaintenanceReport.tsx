import React from 'react';

interface MaintenanceReportProps {
  upcoming: number;
  overdue: number;
  emergency: number;
  completed: number;
  avgRepairTime: string;
}

export const MaintenanceReport: React.FC<MaintenanceReportProps> = ({
  upcoming,
  overdue,
  emergency,
  completed,
  avgRepairTime,
}) => {
  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Maintenance Summary
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Service KPIs</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Upcoming Tasks</span>
          <span className="text-white text-base font-bold">{upcoming} Logs</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-red-500 uppercase font-bold">Overdue Service</span>
          <span className="text-red-500 text-base font-bold">{overdue} Overdue</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-red-400 uppercase font-bold">Emergency Breakdowns</span>
          <span className="text-red-400 text-base font-bold">{emergency} Events</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Completed Jobs</span>
          <span className="text-white text-base font-bold">{completed} Completed</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors col-span-2 sm:col-span-1">
          <span className="text-[9px] text-gray-500 uppercase">Avg Repair Time</span>
          <span className="text-[#D97706] text-base font-bold">{avgRepairTime}</span>
        </div>
      </div>
    </div>
  );
};
