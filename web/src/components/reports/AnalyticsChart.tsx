import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, ComposedChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import type { FuelLog } from '../../mock/fuel';
import type { ExpenseRecord } from '../../mock/expenses';
import type { Trip } from '../../mock/trips';
import type { Vehicle } from '../../mock/vehicles';
import type { Driver } from '../../mock/drivers';

interface AnalyticsChartProps {
  fuelLogs: FuelLog[];
  expenses: ExpenseRecord[];
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  fuelLogs,
  expenses: _expenses,
  trips,
  vehicles,
  drivers: _drivers,
}) => {
  const COLORS = ['#D97706', '#2563EB', '#10B981', '#8B5CF6', '#EF4444', '#71717A', '#EC4899'];

  const formatCost = (val: number) => {
    return `₹${(val / 1000).toFixed(0)}k`;
  };

  const utilizationData = [
    { month: 'Feb', rate: 76 },
    { month: 'Mar', rate: 81 },
    { month: 'Apr', rate: 79 },
    { month: 'May', rate: 83 },
    { month: 'Jun', rate: 84 },
    { month: 'Jul', rate: 87 },
  ];

  const financialSummaryData = [
    { month: 'Feb', revenue: 240000, operatingCost: 110000 },
    { month: 'Mar', revenue: 290000, operatingCost: 135000 },
    { month: 'Apr', revenue: 275000, operatingCost: 128000 },
    { month: 'May', revenue: 310000, operatingCost: 154000 },
    { month: 'Jun', revenue: 340000, operatingCost: 168000 },
    { month: 'Jul', revenue: 380000, operatingCost: 192000 },
  ];

  const tripCompletionData = [
    { month: 'Feb', completed: 88, cancelled: 4 },
    { month: 'Mar', completed: 96, cancelled: 3 },
    { month: 'Apr', completed: 92, cancelled: 5 },
    { month: 'May', completed: 104, cancelled: 2 },
    { month: 'Jun', completed: 112, cancelled: 4 },
    { month: 'Jul', completed: trips.filter(t => t.status === 'Completed').length || 120, cancelled: trips.filter(t => t.status === 'Cancelled').length || 6 },
  ];

  const vehicleStatusData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach(v => {
      counts[v.status] = (counts[v.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [vehicles]);

  const regionalTripData = React.useMemo(() => {
    const counts: Record<string, number> = { North: 0, South: 0, East: 0, West: 0 };
    trips.forEach(t => {
      const matchVeh = vehicles.find(v => v.registrationNumber === t.assignedVehicle);
      const reg = matchVeh?.region || 'North';
      counts[reg] = (counts[reg] || 0) + 1;
    });
    return Object.entries(counts).map(([region, count]) => ({ region, count }));
  }, [trips, vehicles]);

  const fuelConsumptionTrend = React.useMemo(() => {
    return [
      { month: 'Feb', quantity: 380 },
      { month: 'Mar', quantity: 420 },
      { month: 'Apr', quantity: 410 },
      { month: 'May', quantity: 450 },
      { month: 'Jun', quantity: 490 },
      { month: 'Jul', quantity: Math.round(fuelLogs.reduce((acc, curr) => acc + curr.quantity, 0)) || 520 },
    ];
  }, [fuelLogs]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-[9px] w-full">
      {/* 1. Fleet Utilization */}
      <div className="flex flex-col gap-2 border border-[#2C2C2C] bg-[#111111] p-4 text-left">
        <span className="text-[10px] text-white uppercase font-bold border-b border-[#2C2C2C] pb-2 mb-2">Fleet Utilization Trend (%)</span>
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={utilizationData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
              <XAxis dataKey="month" stroke="#8E8E93" />
              <YAxis stroke="#8E8E93" domain={[50, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#2C2C2C', borderRadius: '0px', color: '#fff', fontSize: '9px' }} formatter={(val: any) => [`${val}%`, 'Utilization']} />
              <Line type="monotone" dataKey="rate" stroke="#D97706" strokeWidth={2} activeDot={{ r: 4 }} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Revenue vs Expenses */}
      <div className="flex flex-col gap-2 border border-[#2C2C2C] bg-[#111111] p-4 text-left">
        <span className="text-[10px] text-white uppercase font-bold border-b border-[#2C2C2C] pb-2 mb-2">Revenue vs Expense Trend</span>
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={financialSummaryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
              <XAxis dataKey="month" stroke="#8E8E93" />
              <YAxis stroke="#8E8E93" tickFormatter={formatCost} />
              <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#2C2C2C', borderRadius: '0px', color: '#fff', fontSize: '9px' }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '8px', textTransform: 'uppercase' }} />
              <Bar dataKey="revenue" name="Revenue" fill="#2563EB" />
              <Area dataKey="operatingCost" name="Op Cost" fill="#EF4444" stroke="#EF4444" fillOpacity={0.15} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Trip Completion Trend */}
      <div className="flex flex-col gap-2 border border-[#2C2C2C] bg-[#111111] p-4 text-left">
        <span className="text-[10px] text-white uppercase font-bold border-b border-[#2C2C2C] pb-2 mb-2">Trip Completion Trend</span>
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tripCompletionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
              <XAxis dataKey="month" stroke="#8E8E93" />
              <YAxis stroke="#8E8E93" />
              <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#2C2C2C', borderRadius: '0px', color: '#fff', fontSize: '9px' }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '8px', textTransform: 'uppercase' }} />
              <Bar dataKey="completed" name="Completed" fill="#10B981" stackId="a" />
              <Bar dataKey="cancelled" name="Cancelled" fill="#EF4444" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Fuel Consumption Trend */}
      <div className="flex flex-col gap-2 border border-[#2C2C2C] bg-[#111111] p-4 text-left">
        <span className="text-[10px] text-white uppercase font-bold border-b border-[#2C2C2C] pb-2 mb-2">Monthly Fuel Consumption (L)</span>
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChartWrapper data={fuelConsumptionTrend} />
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Vehicle Status Share */}
      <div className="flex flex-col gap-2 border border-[#2C2C2C] bg-[#111111] p-4 text-left">
        <span className="text-[10px] text-white uppercase font-bold border-b border-[#2C2C2C] pb-2 mb-2">Vehicle Status Distribution</span>
        <div className="w-full h-44 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={vehicleStatusData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={55}
                paddingAngle={2}
                dataKey="value"
              >
                {vehicleStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#2C2C2C', borderRadius: '0px', color: '#fff', fontSize: '9px' }} />
              <Legend iconSize={6} layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '8px', textTransform: 'uppercase' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. Regional Load Distribution */}
      <div className="flex flex-col gap-2 border border-[#2C2C2C] bg-[#111111] p-4 text-left">
        <span className="text-[10px] text-white uppercase font-bold border-b border-[#2C2C2C] pb-2 mb-2">Regional Dispatch Load</span>
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalTripData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
              <XAxis dataKey="region" stroke="#8E8E93" />
              <YAxis stroke="#8E8E93" />
              <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#2C2C2C', borderRadius: '0px', color: '#fff', fontSize: '9px' }} />
              <Bar dataKey="count" name="Trips" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Helper components inside file
import { AreaChart, Area as AreaRechart } from 'recharts';
const AreaChartWrapper: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
      <XAxis dataKey="month" stroke="#8E8E93" />
      <YAxis stroke="#8E8E93" />
      <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#2C2C2C', borderRadius: '0px', color: '#fff', fontSize: '9px' }} formatter={(val: any) => [`${val} L`, 'Consumption']} />
      <AreaRechart type="monotone" dataKey="quantity" fill="#D97706" stroke="#D97706" fillOpacity={0.15} />
    </AreaChart>
  );
};
