import React from 'react';

export interface ProgressSegment {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

interface ProgressBarProps {
  segments: ProgressSegment[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ segments }) => {
  return (
    <div className="flex flex-col gap-3 select-none">
      <div className="h-3 w-full bg-[#1C1C20] flex rounded-none overflow-hidden border border-[#2C2C2C]">
        {segments.map((segment, idx) => (
          <div
            key={idx}
            style={{ width: `${segment.percentage}%` }}
            className={`${segment.color} h-full transition-all duration-500`}
            title={`${segment.label}: ${segment.count} (${segment.percentage}%)`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-1">
        {segments.map((segment, idx) => (
          <div key={idx} className="flex items-center gap-2 text-left">
            <div className={`w-2.5 h-2.5 ${segment.color} rounded-none`} />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-sans uppercase font-bold tracking-wide">
                {segment.label}
              </span>
              <span className="text-xs font-semibold text-white font-mono leading-none mt-0.5">
                {segment.count} <span className="text-[9px] text-gray-500 font-normal">({segment.percentage}%)</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
