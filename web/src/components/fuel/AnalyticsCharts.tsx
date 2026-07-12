import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import type { FuelLog } from '../../mock/fuel';
import type { ExpenseRecord } from '../../mock/expenses';

interface AnalyticsChartsProps {
  fuelLogs: FuelLog[];
  expenses: ExpenseRecord[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ fuelLogs, expenses }) => {
  const [activeTab, setActiveTab] = useState<'fuel' | 'expenses'>('fuel');

  const formatCost = (val: number) => {
    return `₹${(val / 1000).toFixed(0)}k`;
  };

  const COLORS = ['#D97706', '#2563EB', '#10B981', '#8B5CF6', '#EF4444', '#71717A', '#EC4899'];

  const fuelTypeData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    fuelLogs.forEach(l => {
      counts[l.fuelType] = (counts[l.fuelType] || 0) + l.quantity;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [fuelLogs]);

  const vehicleFuelData = React.useMemo(() => {
    const totals: Record<string, number> = {};
    fuelLogs.forEach(l => {
      totals[l.vehicleReg] = (totals[l.vehicleReg] || 0) + l.quantity;
    });
    return Object.entries(totals)
      .map(([vehicle, quantity]) => ({ vehicle, quantity: Math.round(quantity) }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [fuelLogs]);

  const monthlyFuelCostData = React.useMemo(() => {
    return [
      { month: 'Feb', cost: 35000 },
      { month: 'Mar', cost: 42000 },
      { month: 'Apr', cost: 38000 },
      { month: 'May', cost: 46000 },
      { month: 'Jun', cost: 51000 },
      { month: 'Jul', cost: fuelLogs.reduce((acc, curr) => acc + curr.totalCost, 0) },
    ];
  }, [fuelLogs]);

  const monthlyExpenseData = React.useMemo(() => {
    return [
      { month: 'Feb', cost: 18000 },
      { month: 'Mar', cost: 24000 },
      { month: 'Apr', cost: 32000 },
      { month: 'May', cost: 29000 },
      { month: 'Jun', cost: 45000 },
      { month: 'Jul', cost: expenses.filter(e => e.status === 'Paid' || e.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0) },
    ];
  }, [expenses]);

  const expenseCategoryData = React.useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach(e => {
      if (e.status === 'Paid' || e.status === 'Approved') {
        totals[e.category] = (totals[e.category] || 0) + e.amount;
      }
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const topVehicleExpenses = React.useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach(e => {
      if (e.status === 'Paid' || e.status === 'Approved') {
        totals[e.vehicleReg] = (totals[e.vehicleReg] || 0) + e.amount;
      }
    });
    return Object.entries(totals)
      .map(([vehicle, amount]) => ({ vehicle, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [expenses]);

  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Cost & Telemetry Analytics
        </h3>
        <div className="flex gap-1.5 bg-[#0F0F10] border border-[#2C2C2C] p-0.5 text-[9px] uppercase tracking-wider font-bold">
          <button
            onClick={() => setActiveTab('fuel')}
            className={`px-3 py-1 cursor-pointer transition-colors ${
              activeTab === 'fuel' 
                ? 'bg-[#D97706] text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Fuel Logs
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-3 py-1 cursor-pointer transition-colors ${
              activeTab === 'expenses' 
                ? 'bg-[#D97706] text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      {activeTab === 'fuel' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart 1 */}
          <div className="flex flex-col gap-2 border border-[#2C2C2C]/50 bg-[#0F0F10] p-4">
            <span className="text-[9px] text-gray-500 uppercase font-bold">Monthly Fuel Cost Trend</span>
            <div className="w-full h-48 text-[9px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyFuelCostData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
                  <XAxis dataKey="month" stroke="#8E8E93" />
                  <YAxis stroke="#8E8E93" tickFormatter={formatCost} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111111', borderColor: '#2C2C2C', borderRadius: '0px', color: '#fff', fontSize: '10px' }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Total Cost']}
                  />
                  <Line type="monotone" dataKey="cost" stroke="#D97706" strokeWidth={2} activeDot={{ r: 4 }} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="flex flex-col gap-2 border border-[#2C2C2C]/50 bg-[#0F0F10] p-4">
            <span className="text-[9px] text-gray-500 uppercase font-bold">Fuel Consumption by Vehicle (Litres)</span>
            <div className="w-full h-48 text-[9px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vehicleFuelData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
                  <XAxis dataKey="vehicle" stroke="#8E8E93" />
                  <YAxis stroke="#8E8E93" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111111', borderColor: '#2C2C2C', borderRadius: '0px', color: '#fff', fontSize: '10px' }}
                    formatter={(val: any) => [`${val} L`, 'Quantity']}
                  />
                  <Bar dataKey="quantity" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3 */}
          <div className="flex flex-col gap-2 border border-[#2C2C2C]/50 bg-[#0F0F10] p-4">
            <span className="text-[9px] text-gray-500 uppercase font-bold">Fuel Type Distribution</span>
            <div className="w-full h-48 text-[9px] flex items-center justify-center">
              {fuelTypeData.length === 0 ? (
                <span className="text-[9px] text-gray-600">NO DATA REGISTERED</span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fuelTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {fuelTypeData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111111', borderColor: '#2C2C2C', borderRadius: '0px', color: '#fff', fontSize: '10px' }}
                      formatter={(val: any, name: any) => [`${val} L`, name]}
                    />
                    <Legend iconSize={8} layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart 1 */}
          <div className="flex flex-col gap-2 border border-[#2C2C2C]/50 bg-[#0F0F10] p-4">
            <span className="text-[9px] text-gray-500 uppercase font-bold">Monthly Operational Expenses</span>
            <div className="w-full h-48 text-[9px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyExpenseData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
                  <XAxis dataKey="month" stroke="#8E8E93" />
                  <YAxis stroke="#8E8E93" tickFormatter={formatCost} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111111', borderColor: '#2C2C2C', borderRadius: '0px', color: '#fff', fontSize: '10px' }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Expense Amount']}
                  />
                  <Line type="monotone" dataKey="cost" stroke="#10B981" strokeWidth={2} activeDot={{ r: 4 }} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="flex flex-col gap-2 border border-[#2C2C2C]/50 bg-[#0F0F10] p-4">
            <span className="text-[9px] text-gray-500 uppercase font-bold">Expense Category Share</span>
            <div className="w-full h-48 text-[9px] flex items-center justify-center">
              {expenseCategoryData.length === 0 ? (
                <span className="text-[9px] text-gray-600">NO DATA REGISTERED</span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {expenseCategoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111111', borderColor: '#2C2C2C', borderRadius: '0px', color: '#fff', fontSize: '10px' }}
                      formatter={(val: any, name: any) => [`₹${Number(val).toLocaleString()}`, name]}
                    />
                    <Legend iconSize={6} layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '8px', textTransform: 'uppercase', lineHeight: '14px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 3 */}
          <div className="flex flex-col gap-2 border border-[#2C2C2C]/50 bg-[#0F0F10] p-4">
            <span className="text-[9px] text-gray-500 uppercase font-bold">Top 5 Highest Expense Vehicles</span>
            <div className="w-full h-48 text-[9px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topVehicleExpenses} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
                  <XAxis dataKey="vehicle" stroke="#8E8E93" />
                  <YAxis stroke="#8E8E93" tickFormatter={formatCost} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111111', borderColor: '#2C2C2C', borderRadius: '0px', color: '#fff', fontSize: '10px' }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Expenses']}
                  />
                  <Bar dataKey="amount" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
