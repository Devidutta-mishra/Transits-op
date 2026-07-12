import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MaintenanceChartProps {
  data: { month: string; preventive: number; corrective: number; breakdown: number }[];
}

export const MaintenanceChart: React.FC<MaintenanceChartProps> = ({ data }) => {
  const formatCost = (val: number) => {
    return `₹${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Maintenance Cost Matrix Analysis
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">维修成本分析</span>
      </div>

      <div className="w-full h-56 text-[10px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
            <XAxis dataKey="month" stroke="#A1A1AA" />
            <YAxis stroke="#A1A1AA" tickFormatter={formatCost} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111111',
                borderColor: '#2C2C2C',
                borderRadius: '0px',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '11px',
              }}
              formatter={(value: any) => [value ? `₹${Number(value).toLocaleString()}` : '', '']}
            />
            <Bar dataKey="preventive" name="Preventive" fill="#2563EB" radius={[0, 0, 0, 0]} />
            <Bar dataKey="corrective" name="Corrective" fill="#D97706" radius={[0, 0, 0, 0]} />
            <Bar dataKey="breakdown" name="Breakdown" fill="#EF4444" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 justify-center text-[9px] uppercase mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#2563EB]" />
          <span className="text-gray-400">Preventive</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#D97706]" />
          <span className="text-gray-400">Corrective</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#EF4444]" />
          <span className="text-gray-400">Breakdown</span>
        </div>
      </div>
    </div>
  );
};
