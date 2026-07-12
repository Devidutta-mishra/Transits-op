import React from 'react';
import { Sparkles, TrendingUp, ShieldAlert, Award } from 'lucide-react';

export const ExecutiveInsight: React.FC = () => {
  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-4 h-full w-full">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Executive Insights Panel
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold font-mono">BI Insights</span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3 p-3 border border-[#2C2C2C]/50 bg-[#0F0F10] hover:border-[#D97706]/20 transition-colors">
          <div className="w-8 h-8 flex items-center justify-center border text-xs shrink-0 text-[#D97706] bg-[#D97706]/10 border-[#D97706]/20">
            <TrendingUp size={14} />
          </div>
          <div className="flex-1 flex flex-col gap-0.5 font-sans">
            <span className="text-xs text-white font-bold">Fleet Utilization Lift</span>
            <p className="text-[10px] text-gray-400 leading-normal mt-0.5">
              Fleet utilization increased by <span className="font-mono font-bold text-green-500">12%</span> compared to the previous month, driven by higher inter-state regional dispatches.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 border border-[#2C2C2C]/50 bg-[#0F0F10] hover:border-[#D97706]/20 transition-colors">
          <div className="w-8 h-8 flex items-center justify-center border text-xs shrink-0 text-green-500 bg-green-600/10 border-green-500/20">
            <Award size={14} />
          </div>
          <div className="flex-1 flex flex-col gap-0.5 font-sans">
            <span className="text-xs text-white font-bold">Trip Completion Performance</span>
            <p className="text-[10px] text-gray-400 leading-normal mt-0.5">
              Average fleet trip completion rate reached <span className="font-mono font-bold text-green-500">96.4%</span>. Cancelled routes dropped by 18% compared to the previous period.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 border border-[#2C2C2C]/50 bg-[#0F0F10] hover:border-[#D97706]/20 transition-colors">
          <div className="w-8 h-8 flex items-center justify-center border text-xs shrink-0 text-blue-400 bg-blue-600/10 border-blue-600/20">
            <Sparkles size={14} />
          </div>
          <div className="flex-1 flex flex-col gap-0.5 font-sans">
            <span className="text-xs text-white font-bold">High Earner Asset</span>
            <p className="text-[10px] text-gray-400 leading-normal mt-0.5">
              Vehicle <span className="font-mono font-bold text-[#D97706]">MH-12-PQ-4567</span> generated the highest monthly revenue of <span className="font-mono font-bold text-white">₹3,80,000</span> across all active routes.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 border border-[#2C2C2C]/50 bg-[#0F0F10] hover:border-[#D97706]/20 transition-colors">
          <div className="w-8 h-8 flex items-center justify-center border text-xs shrink-0 text-red-500 bg-red-600/10 border-red-500/20">
            <ShieldAlert size={14} />
          </div>
          <div className="flex-1 flex flex-col gap-0.5 font-sans">
            <span className="text-xs text-white font-bold">Outflow & Maintenance Optimization</span>
            <p className="text-[10px] text-gray-400 leading-normal mt-0.5">
              Maintenance operating costs reduced by <span className="font-mono font-bold text-green-500">8%</span> this month. Predictive checks scheduled in the calendar minimized highway towing needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
