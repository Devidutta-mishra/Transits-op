import React from 'react';
import { cn } from '../../utils/cn';

interface ActivityItemProps {
  message: string;
  timestamp: string;
  type?: 'info' | 'warning' | 'success' | 'danger';
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ message, timestamp, type = 'info' }) => {
  return (
    <div className="flex gap-3 text-left py-2 border-b border-[#2C2C2C]/40 last:border-b-0 select-none">
      <div className="flex flex-col items-center mt-1.5">
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-none",
            type === 'info' && "bg-[#D97706]",
            type === 'success' && "bg-green-600",
            type === 'warning' && "bg-yellow-600",
            type === 'danger' && "bg-red-600"
          )}
        />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-white font-sans leading-relaxed">
          {message}
        </span>
        <span className="text-[9px] text-gray-500 font-mono tracking-wide uppercase">
          {timestamp}
        </span>
      </div>
    </div>
  );
};
