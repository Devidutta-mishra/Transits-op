import React from 'react';
import type { RecentActivityEvent } from '../../mock/maintenance';
import { Wrench, CheckCircle, AlertTriangle, RefreshCw, Package } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RecentActivityProps {
  activities: RecentActivityEvent[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getEventStyle = (type: RecentActivityEvent['eventType']) => {
    if (type === 'Breakdown') return { icon: AlertTriangle, color: 'text-red-500 bg-red-600/10 border-red-500/20' };
    if (type === 'Completed') return { icon: CheckCircle, color: 'text-green-500 bg-green-600/10 border-green-500/20' };
    if (type === 'Returned') return { icon: RefreshCw, color: 'text-blue-400 bg-blue-600/10 border-blue-600/20' };
    if (type === 'Parts') return { icon: Package, color: 'text-yellow-400 bg-yellow-600/10 border-yellow-600/20' };
    return { icon: Wrench, color: 'text-gray-400 bg-zinc-800 border-zinc-700' };
  };

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Maintenance activity Log
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">最新动态</span>
      </div>

      <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
        {activities.map(activity => {
          const style = getEventStyle(activity.eventType);
          const Icon = style.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-2.5 border border-[#2C2C2C]/50 bg-[#0F0F10] hover:border-[#D97706]/30 transition-colors"
            >
              <div className={cn("w-7 h-7 flex items-center justify-center border text-xs shrink-0", style.color)}>
                <Icon size={12} />
              </div>

              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-[10px] text-white font-sans font-medium leading-tight">
                  {activity.message}
                </span>
                <span className="text-[8px] text-gray-500 font-mono mt-0.5">
                  {new Date(activity.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} // {formatTime(activity.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
