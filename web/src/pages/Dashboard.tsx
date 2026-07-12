import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import { mockDashboardData } from '../mock/dashboard';
import { api } from '../services/api';
import { StatCard } from '../components/dashboard/StatCard';
import { DashboardTable } from '../components/dashboard/DashboardTable';
import { ProgressBar } from '../components/dashboard/ProgressBar';
import { ActivityItem } from '../components/dashboard/ActivityItem';
import { SectionHeader } from '../components/dashboard/SectionHeader';
import { SkeletonLoader } from '../components/dashboard/SkeletonLoader';
import { Badge } from '../components/ui/Badge';
import { ROLE_LABELS } from '../constants/permissions';
import { 
  Truck, Users, Route, Calendar, CheckCircle2, Wrench, 
  TrendingUp, Fuel, ShieldAlert, UserCheck, ClipboardCheck, 
  CreditCard, Milestone, RefreshCw, ChevronRight, PlusCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { role } = usePermission();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<any>(mockDashboardData);

  const fetchOverview = async () => {
    try {
      const liveOverview = await api.dashboard.getOverview();
      setDashboardData((prev: any) => {
        // Calculate percentages for vehicle status progress bar based on live overview
        const total = liveOverview.totalVehicles || 1;
        const liveVehicleStatus = [
          { label: 'Available', count: liveOverview.availableVehicles || 0, percentage: Math.round(((liveOverview.availableVehicles || 0) / total) * 100), color: 'bg-green-600' },
          { label: 'In Trip', count: liveOverview.activeVehicles || 0, percentage: Math.round(((liveOverview.activeVehicles || 0) / total) * 100), color: 'bg-[#D97706]' },
          { label: 'Maintenance', count: liveOverview.vehiclesInMaintenance || 0, percentage: Math.round(((liveOverview.vehiclesInMaintenance || 0) / total) * 100), color: 'bg-red-600' },
          { label: 'Idle', count: liveOverview.idleDrivers || 0, percentage: Math.round(((liveOverview.idleDrivers || 0) / total) * 100), color: 'bg-zinc-600' },
        ];

        return {
          ...prev,
          totalVehicles: liveOverview.totalVehicles ?? prev.totalVehicles,
          activeDrivers: liveOverview.driversOnDuty ?? prev.activeDrivers,
          tripsToday: liveOverview.completedTripsToday ?? prev.tripsToday,
          scheduledTrips: liveOverview.activeTrips ?? prev.scheduledTrips,
          vehiclesAvailable: liveOverview.availableVehicles ?? prev.vehiclesAvailable,
          vehiclesInMaintenance: liveOverview.vehiclesInMaintenance ?? prev.vehiclesInMaintenance,
          vehicleStatus: liveVehicleStatus
        };
      });
    } catch (err) {
      console.error('Failed to fetch dashboard overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    );

    fetchOverview();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchOverview();
  };

  if (!user || !role) return null;

  const showStatCard = (cardId: string): boolean => {
    switch (role) {
      case 'ADMINISTRATOR':
      case 'FLEET_MANAGER':
        return true;
      case 'DISPATCHER':
        return ['totalVehicles', 'activeDrivers', 'tripsToday', 'scheduledTrips', 'vehiclesAvailable'].includes(cardId);
      case 'SAFETY_OFFICER':
        return ['totalVehicles', 'activeDrivers', 'vehiclesAvailable', 'vehiclesInMaintenance', 'safetyAlerts', 'driverCompliance', 'pendingInspections'].includes(cardId);
      case 'FINANCIAL_ANALYST':
        return ['monthlyRevenue', 'fuelCost', 'operatingCost', 'costPerKm'].includes(cardId);
      default:
        return false;
    }
  };

  const getQuickActions = () => {
    const allActions = [
      { name: 'Register Vehicle', path: '/fleet', role: ['ADMINISTRATOR', 'FLEET_MANAGER'] },
      { name: 'Assign Driver', path: '/drivers', role: ['ADMINISTRATOR', 'FLEET_MANAGER', 'DISPATCHER'] },
      { name: 'Create Trip', path: '/trips', role: ['ADMINISTRATOR', 'FLEET_MANAGER', 'DISPATCHER'] },
      { name: 'Add Fuel Log', path: '/fuel', role: ['ADMINISTRATOR', 'FLEET_MANAGER', 'FINANCIAL_ANALYST'] },
      { name: 'Schedule Maintenance', path: '/maintenance', role: ['ADMINISTRATOR', 'FLEET_MANAGER', 'SAFETY_OFFICER'] },
    ];
    return allActions.filter(action => action.role.includes(role));
  };

  const getKPIs = () => {
    const list = [];
    if (showStatCard('totalVehicles')) {
      list.push({ title: 'Total Vehicles', value: dashboardData.totalVehicles, icon: Truck, subtitle: 'Total active fleet count', trend: { value: 'Stable', type: 'neutral' as const } });
    }
    if (showStatCard('activeDrivers')) {
      list.push({ title: 'Active Drivers', value: dashboardData.activeDrivers, icon: Users, subtitle: 'On duty operators', trend: { value: '+4%', type: 'up' as const } });
    }
    if (showStatCard('tripsToday')) {
      list.push({ title: 'Trips Today', value: dashboardData.tripsToday, icon: Route, subtitle: 'Active consignments dispatch', trend: { value: '+12%', type: 'up' as const } });
    }
    if (showStatCard('scheduledTrips')) {
      list.push({ title: 'Scheduled Trips', value: dashboardData.scheduledTrips, icon: Calendar, subtitle: 'Trips queue next 24h', trend: { value: '+2', type: 'up' as const } });
    }
    if (showStatCard('vehiclesAvailable')) {
      list.push({ title: 'Vehicles Available', value: dashboardData.vehiclesAvailable, icon: CheckCircle2, subtitle: 'Idle in yard storage', trend: { value: '-2%', type: 'down' as const } });
    }
    if (showStatCard('vehiclesInMaintenance')) {
      list.push({ title: 'Vehicles In Maintenance', value: dashboardData.vehiclesInMaintenance, icon: Wrench, subtitle: 'Active repair schedules', trend: { value: '-1', type: 'down' as const } });
    }
    if (showStatCard('monthlyRevenue')) {
      list.push({ title: 'Monthly Revenue', value: dashboardData.monthlyRevenue, icon: TrendingUp, subtitle: 'Current cycle billing', trend: { value: '+8.3%', type: 'up' as const } });
    }
    if (showStatCard('fuelCost')) {
      list.push({ title: 'Fuel Cost', value: dashboardData.fuelCost, icon: Fuel, subtitle: 'Audit card transactions', trend: { value: '+1.2%', type: 'up' as const } });
    }
    if (showStatCard('safetyAlerts')) {
      list.push({ title: 'Safety Alerts', value: dashboardData.safetyAlerts, icon: ShieldAlert, subtitle: 'Pending compliance alerts', trend: { value: 'Critical', type: 'down' as const } });
    }
    if (showStatCard('driverCompliance')) {
      list.push({ title: 'Driver Compliance', value: dashboardData.driverCompliance, icon: UserCheck, subtitle: 'HOS limit audits score', trend: { value: '+0.5%', type: 'up' as const } });
    }
    if (showStatCard('pendingInspections')) {
      list.push({ title: 'Pending Inspections', value: dashboardData.pendingInspections, icon: ClipboardCheck, subtitle: 'DVIR logs checklist', trend: { value: 'Pending', type: 'neutral' as const } });
    }
    if (showStatCard('operatingCost')) {
      list.push({ title: 'Operating Cost', value: dashboardData.operatingCost, icon: CreditCard, subtitle: 'Yard tolls & logistics cost', trend: { value: '-4.2%', type: 'up' as const } });
    }
    if (showStatCard('costPerKm')) {
      list.push({ title: 'Cost Per Km', value: dashboardData.costPerKm, icon: Milestone, subtitle: 'Average mileage expenses', trend: { value: 'Target: ₹14.00', type: 'neutral' as const } });
    }
    return list;
  };

  const showOperationalDecks = role === 'ADMINISTRATOR' || role === 'FLEET_MANAGER' || role === 'DISPATCHER';
  const showFinancialDecks = role === 'ADMINISTRATOR' || role === 'FLEET_MANAGER' || role === 'FINANCIAL_ANALYST';
  const showSafetyDecks = role === 'ADMINISTRATOR' || role === 'SAFETY_OFFICER';

  return (
    <div className="flex flex-col gap-6 text-left select-none font-sans">
      <div className="border-b border-[#2C2C2C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono tracking-widest uppercase">
            <span>Dashboard</span>
            <ChevronRight size={10} />
            <span className="text-white">Overview</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white mt-1 leading-none">
            OPERATIONS DECK
          </h1>
          <p className="text-[11px] text-gray-500 mt-2 font-mono tracking-wide">
            CURRENT_SESSION_DATE: {currentDate}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-[#2C2C2C] pr-4 h-8">
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">ROLE:</span>
            <Badge variant="orange">{ROLE_LABELS[user.role]}</Badge>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 h-9 px-3 bg-[#111111] border border-[#2C2C2C] text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-[#1C1C20] hover:border-[#D97706] active:bg-[#121214] disabled:opacity-50 rounded-none cursor-pointer transition-colors"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader variant="cards" count={getKPIs().length} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {getKPIs().map((kpi, idx) => (
            <StatCard
              key={idx}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              subtitle={kpi.subtitle}
              trend={kpi.trend}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {showOperationalDecks && (
            <>
              <div className="border border-[#2C2C2C] bg-[#111111] p-5 rounded-none flex flex-col gap-4">
                <SectionHeader title="Active Fleet Dispatch Queue" subtitle="Real-time route tracking for today's manifests" />
                {isLoading ? (
                  <SkeletonLoader variant="table" />
                ) : (
                  <DashboardTable trips={dashboardData.trips} />
                )}
              </div>

              <div className="border border-[#2C2C2C] bg-[#111111] p-5 rounded-none">
                <SectionHeader title="Fleet Status Allocation" subtitle="Horizontal distribution of active vehicle segments" />
                {isLoading ? (
                  <div className="h-20 bg-[#1C1C20] animate-pulse rounded-none" />
                ) : (
                  <div className="pt-2">
                    <ProgressBar segments={dashboardData.vehicleStatus} />
                  </div>
                )}
              </div>
            </>
          )}

          {showFinancialDecks && (
            <div className="border border-[#2C2C2C] bg-[#111111] p-5 rounded-none flex flex-col gap-4">
              <SectionHeader title="Fleet Utilization Metrics" subtitle="Monthly utilization rates of commercial assets" />
              {isLoading ? (
                <SkeletonLoader variant="chart" />
              ) : (
                <div className="h-64 w-full pr-4 pt-4 font-mono text-[10px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.utilizationHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" vertical={false} />
                      <XAxis dataKey="month" stroke="#A1A1AA" tickLine={false} />
                      <YAxis stroke="#A1A1AA" tickLine={false} domain={[0, 100]} unit="%" />
                      <Tooltip 
                        cursor={{ fill: '#1C1C20' }}
                        contentStyle={{ backgroundColor: '#111111', border: '1px solid #2C2C2C', borderRadius: '0px' }}
                        labelClassName="text-white font-mono uppercase tracking-wider font-bold"
                        itemStyle={{ color: '#D97706', fontFamily: 'monospace' }}
                      />
                      <Bar dataKey="rate" fill="#D97706" radius={0} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {showSafetyDecks && (
            <>
              <div className="border border-[#2C2C2C] bg-[#111111] p-5 rounded-none flex flex-col gap-4">
                <SectionHeader title="Pending Vehicle Inspections" subtitle="DVIR logs requiring mechanic audit and release sign-off" />
                {isLoading ? (
                  <SkeletonLoader variant="table" />
                ) : (
                  <div className="border border-[#2C2C2C] w-full overflow-hidden">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#0F0F10] border-b border-[#2C2C2C] text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                          <th className="p-3">Asset ID</th>
                          <th className="p-3">Driver Name</th>
                          <th className="p-3">Log Date</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2C2C2C]/50">
                        <tr className="hover:bg-[#1C1C20]">
                          <td className="p-3 font-bold text-[#D97706]">TRK-004</td>
                          <td className="p-3 font-sans">David Jones</td>
                          <td className="p-3">12 Jul 2026</td>
                          <td className="p-3 text-center">
                            <span className="inline-flex px-2 py-0.5 text-[9px] bg-red-600 text-white font-bold uppercase">Critical Fault</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#1C1C20]">
                          <td className="p-3 font-bold text-[#D97706]">TRK-019</td>
                          <td className="p-3 font-sans">Mike Smith</td>
                          <td className="p-3">12 Jul 2026</td>
                          <td className="p-3 text-center">
                            <span className="inline-flex px-2 py-0.5 text-[9px] bg-yellow-600 text-white font-bold uppercase">Pending Release</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#1C1C20]">
                          <td className="p-3 font-bold text-[#D97706]">TRK-088</td>
                          <td className="p-3 font-sans">John Miller</td>
                          <td className="p-3">11 Jul 2026</td>
                          <td className="p-3 text-center">
                            <span className="inline-flex px-2 py-0.5 text-[9px] bg-green-600 text-white font-bold uppercase">Passed</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="border border-[#2C2C2C] bg-[#111111] p-5 rounded-none flex flex-col gap-4">
                <SectionHeader title="Compliance & Safety Violations" subtitle="System alerts generated by vehicle telematics" />
                {isLoading ? (
                  <SkeletonLoader variant="activity" count={2} />
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="border border-red-600/30 bg-red-600/5 p-3 flex gap-3 text-left">
                      <ShieldAlert size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-white uppercase font-sans">Speed Limit Warning // TRK-012</span>
                        <p className="text-[11px] text-[#A1A1AA] font-sans leading-relaxed">Driver John Miller exceeded speed threshold by 15 km/h on highway segment NH-4.</p>
                        <span className="text-[9px] text-gray-500 font-mono">12 JUL 2026 09:12 AM</span>
                      </div>
                    </div>
                    <div className="border border-yellow-600/30 bg-yellow-600/5 p-3 flex gap-3 text-left">
                      <ShieldAlert size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-white uppercase font-sans">Hard Braking Alert // TRK-009</span>
                        <p className="text-[11px] text-[#A1A1AA] font-sans leading-relaxed">Driver Robert Garcia logged secondary hard deceleration event within 1 hour.</p>
                        <span className="text-[9px] text-gray-500 font-mono">12 JUL 2026 08:44 AM</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-6 w-full">
          <div className="border border-[#2C2C2C] bg-[#111111] p-5 rounded-none flex flex-col gap-4">
            <SectionHeader title="Console Activity Stream" subtitle="Live system notification sequence" />
            {isLoading ? (
              <SkeletonLoader variant="activity" count={5} />
            ) : (
              <div className="flex flex-col gap-2">
                {dashboardData.activities.map((act: any) => (
                  <ActivityItem
                    key={act.id}
                    message={act.message}
                    timestamp={act.timestamp}
                    type={act.type}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border border-[#2C2C2C] bg-[#111111] p-5 rounded-none flex flex-col gap-4">
            <SectionHeader title="Console Actions" subtitle="Navigate to operational configurations" />
            <div className="flex flex-col gap-2">
              {getQuickActions().map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className="flex items-center justify-between w-full h-10 px-4 border border-[#2C2C2C] bg-[#0F0F10] text-[#A1A1AA] font-mono text-xs uppercase tracking-wider hover:text-[#D97706] hover:border-[#D97706] transition-colors rounded-none cursor-pointer"
                >
                  <span>{action.name}</span>
                  <PlusCircle size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
