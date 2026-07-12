import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle: string;
  trend?: {
    value: string;
    colorClass: string; 
  };
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon, subtitle, trend }) => {
  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 flex flex-col justify-between h-24 rounded-none text-left select-none relative hover:border-[#D97706]/40 transition-colors flex-1">
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-gray-400 font-sans font-bold uppercase tracking-wider">
          {title}
        </span>
        <span className="text-gray-500">
          <Icon size={13} />
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className="text-lg font-bold text-white font-sans tracking-wide">
          {value}
        </span>
        {trend && (
          <span className={cn("text-[9px] font-mono font-bold", trend.colorClass)}>
            {trend.value}
          </span>
        )}
      </div>

      <span className="text-[8px] text-gray-500 font-sans tracking-wide mt-1">
        {subtitle}
      </span>
    </div>
  );
};
