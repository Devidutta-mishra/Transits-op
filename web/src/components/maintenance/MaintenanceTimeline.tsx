import React from 'react';
import { cn } from '../../utils/cn';
import type { MaintenanceStatus } from '../../mock/maintenance';
import { Check } from 'lucide-react';

interface MaintenanceTimelineProps {
  currentStatus: MaintenanceStatus;
}

export const MaintenanceTimeline: React.FC<MaintenanceTimelineProps> = ({ currentStatus }) => {
  const isCancelled = currentStatus === 'Cancelled';

  const steps = isCancelled 
    ? [
        { label: 'Job Created', status: 'Scheduled' },
        { label: 'Cancelled', status: 'Cancelled' }
      ]
    : [
        { label: 'Maintenance Created', status: 'Scheduled' },
        { label: 'Assigned / Waiting Parts', status: 'Waiting Parts' },
        { label: 'In Progress', status: 'In Progress' },
        { label: 'Quality Check', status: 'Quality Check' },
        { label: 'Completed', status: 'Completed' }
      ];

  const getStepIndex = (status: MaintenanceStatus) => {
    if (isCancelled) return status === 'Cancelled' ? 1 : 0;
    
    if (status === 'Scheduled' || status === 'Overdue') return 0;
    if (status === 'Waiting Parts') return 1;
    if (status === 'In Progress') return 2;
    if (status === 'Completed') return 4;
    return 2;
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="flex flex-col gap-4 font-mono text-[9px] uppercase tracking-wider select-none py-4 px-3 border border-[#2C2C2C] bg-[#0F0F10] rounded-none text-left">
      {steps.map((step, idx) => {
        const isPast = idx < currentIndex;
        const isCurrent = idx === currentIndex || (idx === 3 && currentStatus === 'In Progress');
        const isFuture = idx > currentIndex && !(idx === 3 && currentStatus === 'In Progress');

        return (
          <div key={step.label} className="flex gap-3 relative">
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-2.5 top-5 w-[1px] h-6 -ml-[0.5px]",
                  isPast ? "bg-green-600/30" : "bg-zinc-800"
                )}
              />
            )}

            <div
              className={cn(
                "w-5 h-5 flex items-center justify-center border font-bold text-[8px] z-10 bg-[#0F0F10]",
                isPast && "bg-green-600/10 text-green-500 border-green-600/30",
                isCurrent && (isCancelled ? "bg-red-600/10 text-red-500 border-red-600/30" : "bg-[#D97706]/10 text-[#D97706] border-[#D97706]"),
                isFuture && "bg-zinc-800 text-gray-500 border-zinc-700"
              )}
            >
              {isPast ? <Check size={8} /> : idx + 1}
            </div>

            <div className="flex flex-col gap-0.5 justify-center">
              <span
                className={cn(
                  isPast && "text-green-500",
                  isCurrent && (isCancelled ? "text-red-500" : "text-white font-bold"),
                  isFuture && "text-gray-500"
                )}
              >
                {step.label}
              </span>
              <span className="text-[8px] text-gray-500 font-sans font-normal normal-case">
                {isPast && "Action logs verified"}
                {isCurrent && (isCancelled ? "Manifest aborted" : "Active operation stage")}
                {isFuture && "Pending checklist completions"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
