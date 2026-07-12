import React from 'react';
import type { MaintenanceJob } from '../../mock/maintenance';
import { cn } from '../../utils/cn';

interface MaintenanceCalendarProps {
  jobs: MaintenanceJob[];
  onViewJob: (job: MaintenanceJob) => void;
}

export const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({
  jobs,
  onViewJob,
}) => {
  const scheduledJobs = jobs.filter(j => j.status === 'Scheduled' || j.status === 'Overdue' || j.status === 'In Progress');

  const daysInMonth = 31;
  const startDayOffset = 3; 

  const calendarGrid: (number | null)[] = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarGrid.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarGrid.push(i);
  }
  while (calendarGrid.length % 7 !== 0) {
    calendarGrid.push(null);
  }

  const getJobsForDay = (day: number) => {
    const dateStr = `2026-07-${day.toString().padStart(2, '0')}`;
    return scheduledJobs.filter(j => j.scheduledDate === dateStr);
  };

  const getPriorityColor = (priority: MaintenanceJob['priority']) => {
    if (priority === 'Critical') return 'bg-red-500/10 text-red-500 border border-red-500/30 font-bold';
    if (priority === 'High') return 'bg-amber-500/10 text-[#D97706] border border-[#D97706]/20 font-bold';
    if (priority === 'Medium') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold';
    return 'bg-zinc-800/40 text-zinc-400 border border-zinc-700/30';
  };

  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2C2C2C] pb-3 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Maintenance Scheduler Calendar (July 2026)
        </h3>
        <div className="flex items-center gap-3 text-[9px] uppercase tracking-wider text-gray-500 font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-red-500" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#D97706]" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-blue-400" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-zinc-500" />
            <span>Low</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
        <div className="py-1 bg-[#161618] border border-[#2C2C2C]/50">Sun</div>
        <div className="py-1 bg-[#161618] border-y border-r border-[#2C2C2C]/50">Mon</div>
        <div className="py-1 bg-[#161618] border-y border-r border-[#2C2C2C]/50">Tue</div>
        <div className="py-1 bg-[#161618] border-y border-r border-[#2C2C2C]/50">Wed</div>
        <div className="py-1 bg-[#161618] border-y border-r border-[#2C2C2C]/50">Thu</div>
        <div className="py-1 bg-[#161618] border-y border-r border-[#2C2C2C]/50">Fri</div>
        <div className="py-1 bg-[#161618] border-y border-r border-[#2C2C2C]/50">Sat</div>
      </div>

      <div className="grid grid-cols-7 gap-1 bg-[#161618] p-1 border border-[#2C2C2C]">
        {calendarGrid.map((day, idx) => {
          if (day === null) {
            return (
              <div 
                key={`empty-${idx}`} 
                className="bg-[#0c0c0d] border border-[#2C2C2C]/30 h-20 opacity-30"
              />
            );
          }

          const dayJobs = getJobsForDay(day);
          const isToday = day === 12;

          return (
            <div
              key={`day-${day}`}
              className={cn(
                "bg-[#0F0F10] border border-[#2C2C2C]/50 h-20 p-2 flex flex-col justify-between relative group hover:border-[#D97706]/40 transition-colors",
                isToday && "border-[#D97706] bg-[#141416]"
              )}
            >
              <div className="flex justify-between items-center text-[9px] font-bold">
                <span className={cn(isToday ? "text-[#D97706]" : "text-gray-500")}>
                  {day.toString().padStart(2, '0')}
                </span>
                {isToday && (
                  <span className="text-[7px] bg-[#D97706]/10 px-1 border border-[#D97706]/20 text-[#D97706]">
                    TODAY
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto mt-2 flex flex-col gap-1 pr-0.5">
                {dayJobs.map(job => (
                  <button
                    key={job.jobId}
                    onClick={() => onViewJob(job)}
                    className={cn(
                      "text-[8px] px-1.5 py-0.5 text-left truncate cursor-pointer w-full leading-tight rounded-none hover:border-[#D97706] transition-all",
                      getPriorityColor(job.priority)
                    )}
                    title={`${job.jobId}: ${job.maintenanceType} - ${job.vehicleReg}`}
                  >
                    {job.vehicleReg} // {job.maintenanceType.substring(0, 3).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
