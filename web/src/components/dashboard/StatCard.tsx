import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, subtitle, trend }) => {
  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 flex flex-col justify-between h-28 rounded-none text-left select-none relative hover:border-[#D97706]/40 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400 font-sans font-bold uppercase tracking-wider">
          {title}
        </span>
        <span className="text-gray-500">
          <Icon size={14} />
        </span>
      </div>

      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-xl font-bold text-white font-sans tracking-wide">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-[10px] font-bold font-mono tracking-tighter",
              trend.type === 'up' && "text-white",
              trend.type === 'down' && "text-[#A3A3A3]",
              trend.type === 'neutral' && "text-[#555555]"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <span className="text-[10px] text-gray-500 font-sans tracking-wide mt-auto">
          {subtitle}
        </span>
      )}
    </div>
  );
};
