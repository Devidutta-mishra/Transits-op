import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  sparklineData?: number[];
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  sparklineData,
}) => {
  const points = React.useMemo(() => {
    if (!sparklineData || sparklineData.length === 0) return '';
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;
    const width = 60;
    const height = 16;
    const padding = 1;
    return sparklineData
      .map((val, idx) => {
        const x = (idx / (sparklineData.length - 1)) * width;
        const y = height - padding - ((val - min) / range) * (height - 2 * padding);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [sparklineData]);

  const trendColor = trend?.isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-3 flex flex-col justify-between h-[90px] rounded-none text-left relative select-none hover:border-[#D97706]/40 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[8px] text-gray-400 font-sans font-bold uppercase tracking-wider">
          {title}
        </span>
        <span className="text-gray-500">
          <Icon size={12} />
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-0.5">
        <span className="text-sm font-bold text-white font-sans tracking-wide">
          {value}
        </span>
        {trend && (
          <span className={cn("text-[8px] font-mono font-bold", trendColor)}>
            {trend.value}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#2C2C2C]/50">
        <span className="text-[8px] text-gray-500 font-sans tracking-wide truncate max-w-[80px]">
          {subtitle}
        </span>

        {points && (
          <svg className="w-14 h-4 text-gray-400" viewBox="0 0 60 16">
            <polyline
              fill="none"
              stroke={trend?.isPositive ? '#10B981' : '#EF4444'}
              strokeWidth="1.5"
              points={points}
            />
          </svg>
        )}
      </div>
    </div>
  );
};
