import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  subtitle: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, count, icon: Icon, subtitle }) => {
  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 flex flex-col justify-between h-24 rounded-none text-left select-none relative hover:border-[#D97706]/40 transition-colors flex-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400 font-sans font-bold uppercase tracking-wider">
          {title}
        </span>
        <span className="text-gray-500">
          <Icon size={14} />
        </span>
      </div>

      <div className="flex items-baseline mt-2">
        <span className="text-xl font-bold text-white font-sans tracking-wide">
          {count}
        </span>
      </div>

      <span className="text-[9px] text-gray-500 font-sans tracking-wide mt-1">
        {subtitle}
      </span>
    </div>
  );
};
