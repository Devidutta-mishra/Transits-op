import React from 'react';
import { mockHeatmapData } from '../../mock/reports';

export const HeatMap: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

  const maxVal = Math.max(...mockHeatmapData.flatMap(row => row));

  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Operational Heat Map (Dispatch Density)
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">24-Hour Dispatch Profile</span>
      </div>

      <div className="overflow-x-auto w-full pt-2">
        <div className="min-w-[640px] flex flex-col gap-1">
          {/* Hour labels header */}
          <div className="flex text-[8px] text-gray-500 font-bold mb-1">
            <div className="w-10 shrink-0" />
            <div 
              className="flex-1 gap-0.5 text-center"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
            >
              {hours.map(h => (
                <div key={h}>{h}</div>
              ))}
            </div>
          </div>

          {/* Days grids */}
          {days.map((day, dayIdx) => (
            <div key={day} className="flex items-center">
              {/* Day label */}
              <div className="w-10 text-[9px] text-gray-400 font-bold uppercase shrink-0">
                {day}
              </div>

              {/* Hourly cells */}
              <div 
                className="flex-1 gap-0.5"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
              >
                {hours.map((_, hrIdx) => {
                  const val = mockHeatmapData[dayIdx]?.[hrIdx] || 0;
                  const ratio = maxVal > 0 ? val / maxVal : 0;
                  const bgStyle = ratio > 0 
                    ? { backgroundColor: `rgba(217, 119, 6, ${0.15 + ratio * 0.85})` }
                    : { backgroundColor: '#1C1C20' };

                  return (
                    <div
                      key={hrIdx}
                      style={bgStyle}
                      className="h-4 border border-[#2C2C2C]/10 transition-colors cursor-help relative group"
                      title={`${day} @ ${hrIdx}:00 hrs: ${val} dispatches`}
                    >
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block z-20 bg-black border border-[#2C2C2C] px-2 py-1 text-[8px] text-white whitespace-nowrap rounded-none font-bold uppercase pointer-events-none">
                        {val} Dispatches
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 text-[8px] text-gray-500 font-bold uppercase mt-2 pt-2 border-t border-[#2C2C2C]/40">
        <span>Low Intensity</span>
        <div className="flex gap-0.5">
          <div className="w-2.5 h-2.5 bg-[#1C1C20]" />
          <div className="w-2.5 h-2.5 bg-[#D97706]/20" />
          <div className="w-2.5 h-2.5 bg-[#D97706]/50" />
          <div className="w-2.5 h-2.5 bg-[#D97706]/80" />
          <div className="w-2.5 h-2.5 bg-[#D97706]" />
        </div>
        <span>Peak Density</span>
      </div>
    </div>
  );
};
