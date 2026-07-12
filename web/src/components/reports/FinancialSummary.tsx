import React from 'react';

interface FinancialSummaryProps {
  revenue: number;
  expenses: number;
  maintenance: number;
  fuel: number;
  insurance: number;
  driverCost: number;
  profit: number;
  costPerKm: number;
  avgRevPerTrip: number;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  revenue,
  expenses,
  maintenance,
  fuel,
  insurance,
  driverCost,
  profit,
  costPerKm,
  avgRevPerTrip,
}) => {
  const formatCost = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Financial Operations Summary
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Ledger Balance</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Gross Revenue</span>
          <span className="text-white text-base font-bold">{formatCost(revenue)}</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Operating Expenses</span>
          <span className="text-white text-base font-bold">{formatCost(expenses)}</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Net Operational Profit</span>
          <span className="text-green-500 text-base font-bold">{formatCost(profit)}</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Maintenance Outflow</span>
          <span className="text-white font-semibold">{formatCost(maintenance)}</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Fuel Inflow Outflow</span>
          <span className="text-white font-semibold">{formatCost(fuel)}</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Driver Allowances</span>
          <span className="text-white font-semibold">{formatCost(driverCost)}</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Insurance Premiums</span>
          <span className="text-white font-semibold">{formatCost(insurance)}</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Cost Per Kilometer</span>
          <span className="text-[#D97706] font-bold">₹{costPerKm.toFixed(2)}/km</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Avg Revenue Per Trip</span>
          <span className="text-[#D97706] font-bold">{formatCost(avgRevPerTrip)}/trip</span>
        </div>
      </div>
    </div>
  );
};
