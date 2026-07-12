import React from 'react';
import { cn } from '../../utils/cn';
import type { TripStatus } from '../../mock/trips';
import { Check } from 'lucide-react';

interface TripTimelineProps {
  currentStatus: TripStatus;
}

export const TripTimeline: React.FC<TripTimelineProps> = ({ currentStatus }) => {
  const isCancelled = currentStatus === 'Cancelled';
  
  const steps: { label: string; status: TripStatus }[] = isCancelled 
    ? [
        { label: 'Draft', status: 'Draft' },
        { label: 'Scheduled', status: 'Scheduled' },
        { label: 'Cancelled', status: 'Cancelled' }
      ]
    : [
        { label: 'Draft', status: 'Draft' },
        { label: 'Scheduled', status: 'Scheduled' },
        { label: 'Dispatched', status: 'Dispatched' },
        { label: 'In Transit', status: 'In Transit' },
        { label: 'Completed', status: 'Completed' }
      ];

  const getStepIndex = (status: TripStatus) => {
    return steps.findIndex(s => s.status === status);
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="w-full flex items-center justify-between font-mono text-[9px] uppercase tracking-wider select-none py-2 px-1 border border-[#2C2C2C] bg-[#0F0F10] rounded-none">
      {steps.map((step, idx) => {
        const isPast = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const isFuture = idx > currentIndex;

        return (
          <React.Fragment key={step.status}>
            <div className="flex items-center gap-1.5 px-2">
              <div
                className={cn(
                  "w-4 h-4 flex items-center justify-center border font-bold text-[8px]",
                  isPast && "bg-green-600/10 text-green-500 border-green-600/30",
                  isCurrent && (isCancelled ? "bg-red-600/10 text-red-500 border-red-600/30" : "bg-[#D97706]/10 text-[#D97706] border-[#D97706]"),
                  isFuture && "bg-zinc-800 text-gray-500 border-zinc-700"
                )}
              >
                {isPast ? <Check size={8} /> : idx + 1}
              </div>
              <span
                className={cn(
                  isPast && "text-green-500",
                  isCurrent && (isCancelled ? "text-red-500" : "text-white font-bold"),
                  isFuture && "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[1px]",
                  isPast ? "bg-green-600/30" : "bg-zinc-800"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
