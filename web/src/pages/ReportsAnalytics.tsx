import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import { mockVehiclesData } from '../mock/vehicles';
import type { Vehicle } from '../mock/vehicles';
import { mockDriversData } from '../mock/drivers';
import type { Driver } from '../mock/drivers';
import { mockTripsData } from '../mock/trips';
import type { Trip } from '../mock/trips';
import { mockFuelLogs } from '../mock/fuel';
import type { FuelLog } from '../mock/fuel';
import { mockExpenses } from '../mock/expenses';
import type { ExpenseRecord } from '../mock/expenses';
import { 
  mockVehicleRankings, mockDriverRankings, mockDriverCompliances, 
  mockSavedReports 
} from '../mock/reports';
import type { VehicleRank, DriverRank, DriverCompliance, SavedReport } from '../mock/reports';
import { KpiCard } from '../components/reports/KpiCard';
import { ReportFilters } from '../components/reports/ReportFilters';
import { AnalyticsChart } from '../components/reports/AnalyticsChart';
import { ExecutiveInsight } from '../components/reports/ExecutiveInsight';
import { VehicleRankingTable } from '../components/reports/VehicleRankingTable';
import { DriverRankingTable } from '../components/reports/DriverRankingTable';
import { FinancialSummary } from '../components/reports/FinancialSummary';
import { ComplianceReport } from '../components/reports/ComplianceReport';
import { MaintenanceReport } from '../components/reports/MaintenanceReport';
import { FuelAnalytics } from '../components/reports/FuelAnalytics';
import { TripAnalytics } from '../components/reports/TripAnalytics';
import { HeatMap } from '../components/reports/HeatMap';
import { ExportPanel } from '../components/reports/ExportPanel';
import { SavedReports } from '../components/reports/SavedReports';
import { SkeletonLoader } from '../components/dashboard/SkeletonLoader';
import { ROLE_LABELS } from '../constants/permissions';
import { cn } from '../utils/cn';
import { 
  FileSpreadsheet, ChevronRight, 
  Settings, TrendingUp, DollarSign, Calendar, Users, 
  Truck, ShieldAlert, FileText, ClipboardCheck, Sparkles 
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { user } = useAuth();
  const { role } = usePermission();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);

  const [vehicleRankings, setVehicleRankings] = useState<VehicleRank[]>([]);
  const [driverRankings, setDriverRankings] = useState<DriverRank[]>([]);
  const [driverCompliances, setDriverCompliances] = useState<DriverCompliance[]>([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  const [dateRange, setDateRange] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFuelType, setSelectedFuelType] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    setVehicles(mockVehiclesData);
    setDrivers(mockDriversData);
    setTrips(mockTripsData);
    setFuelLogs(mockFuelLogs);
    setExpenses(mockExpenses);
    
    setVehicleRankings(mockVehicleRankings);
    setDriverRankings(mockDriverRankings);
    setDriverCompliances(mockDriverCompliances);
    setSavedReports(mockSavedReports);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const availableTabs = React.useMemo(() => {
    if (!role) return [];
    if (role === 'FLEET_MANAGER') {
      return ['Overview', 'Operations & Heatmap', 'Finance & Fuel', 'Compliance & Maintenance'];
    }
    if (role === 'DISPATCHER') {
      return ['Operations & Heatmap'];
    }
    if (role === 'SAFETY_OFFICER') {
      return ['Compliance & Maintenance'];
    }
    if (role === 'FINANCIAL_ANALYST') {
      return ['Finance & Fuel'];
    }
    return [];
  }, [role]);

  useEffect(() => {
    if (availableTabs.length > 0 && !activeTab) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  if (!user || !role) return null;

  const handleResetFilters = () => {
    setDateRange('');
    setSelectedVehicle('');
    setSelectedDriver('');
    setSelectedStatus('');
    setSelectedCategory('');
    setSelectedFuelType('');
    setSelectedRegion('');
    setSelectedDepartment('');
  };

  const handleGenerateReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('BI REPORT RECOMPILATION COMPLETE // Financial and fleet logs re-calculated successfully.');
    }, 1000);
  };

  const handleExportPlaceholder = (type: string) => {
    alert(`EXECUTIVE REPORT BROADCAST // Triggering ${type} document pipeline.`);
  };

  const filteredTrips = React.useMemo(() => {
    return trips.filter(t => {
      const matchVehicle = !selectedVehicle || t.assignedVehicle === selectedVehicle;
      const matchDriver = !selectedDriver || t.assignedDriver === selectedDriver;
      const matchStatus = !selectedStatus || t.status === selectedStatus;
      const matchDate = !dateRange || t.departureDate === dateRange;
      
      const vehicleObj = vehicles.find(v => v.registrationNumber === t.assignedVehicle);
      const matchRegion = !selectedRegion || vehicleObj?.region === selectedRegion;
      
      return matchVehicle && matchDriver && matchStatus && matchDate && matchRegion;
    });
  }, [trips, vehicles, selectedVehicle, selectedDriver, selectedStatus, dateRange, selectedRegion]);

  const filteredFuelLogs = React.useMemo(() => {
    return fuelLogs.filter(l => {
      const matchVehicle = !selectedVehicle || l.vehicleReg === selectedVehicle;
      const matchDriver = !selectedDriver || l.driverId === selectedDriver;
      const matchFuelType = !selectedFuelType || l.fuelType === selectedFuelType;
      const matchDate = !dateRange || l.fuelDate === dateRange;
      return matchVehicle && matchDriver && matchFuelType && matchDate;
    });
  }, [fuelLogs, selectedVehicle, selectedDriver, selectedFuelType, dateRange]);

  const filteredExpenses = React.useMemo(() => {
    return expenses.filter(e => {
      const matchVehicle = !selectedVehicle || e.vehicleReg === selectedVehicle;
      const matchCategory = !selectedCategory || e.category === selectedCategory;
      const matchDate = !dateRange || e.expenseDate === dateRange;
      return matchVehicle && matchCategory && matchDate;
    });
  }, [expenses, selectedVehicle, selectedCategory, dateRange]);

  const filteredDriverCompliances = React.useMemo(() => {
    return driverCompliances.filter(c => {
      const driverObj = drivers.find(d => d.fullName === c.driverName);
      const matchDriver = !selectedDriver || driverObj?.driverId === selectedDriver;
      return matchDriver;
    });
  }, [driverCompliances, drivers, selectedDriver]);

  const totalTrips = filteredTrips.length;
  const completedTrips = filteredTrips.filter(t => t.status === 'Completed').length;
  const cancelledTrips = filteredTrips.filter(t => t.status === 'Cancelled').length;

  const fleetUtilization = 86;
  const vehicleAvailability = 79;
  const avgTripDistance = totalTrips > 0
    ? filteredTrips.reduce((acc, curr) => acc + curr.plannedDistance, 0) / totalTrips
    : 0;

  const totalFuelCost = filteredFuelLogs.reduce((acc, curr) => acc + curr.totalCost, 0);
  const totalExpensesCost = filteredExpenses.filter(e => e.status === 'Paid' || e.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0);

  const totalRevenue = completedTrips * 9500; 
  const operatingCost = totalFuelCost + totalExpensesCost;
  const netProfit = totalRevenue - operatingCost;

  const maintenanceCost = filteredExpenses.filter(e => e.category === 'Maintenance' && (e.status === 'Paid' || e.status === 'Approved')).reduce((acc, curr) => acc + curr.amount, 0) || 45000;

  const avgDriverScore = driverRankings.length > 0
    ? driverRankings.reduce((acc, curr) => acc + curr.performanceScore, 0) / driverRankings.length
    : 0;

  const avgEfficiency = filteredFuelLogs.length > 0
    ? filteredFuelLogs.reduce((acc, curr) => acc + curr.fuelEfficiency, 0) / filteredFuelLogs.length
    : 0;

  const validMileageLogs = filteredFuelLogs.filter(l => l.mileageSinceLastFill > 0);
  const avgMileage = validMileageLogs.length > 0
    ? validMileageLogs.reduce((acc, curr) => acc + curr.mileageSinceLastFill, 0) / validMileageLogs.length
    : 0;

  const costPerKm = avgTripDistance > 0 ? operatingCost / (avgTripDistance * totalTrips || 1) : 0;
  const avgRevPerTrip = totalTrips > 0 ? totalRevenue / totalTrips : 0;

  return (
    <div className="flex flex-col gap-6 text-left select-none font-sans">
      {/* Title Header */}
      <div className="border-b border-[#2C2C2C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono tracking-widest uppercase">
            <span>Dashboard</span>
            <ChevronRight size={10} />
            <span className="text-white">Reports & Analytics</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white mt-1 leading-none">
            REPORTS & ANALYTICS
          </h1>
          <p className="text-[11px] text-gray-500 mt-2 font-mono tracking-wide">
            ENTERPRISE BUSINESS INTELLIGENCE // ROLE: {ROLE_LABELS[user.role]}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExportPlaceholder('PDF')}
            className="flex items-center gap-2 h-9 px-3 bg-[#111111] border border-[#2C2C2C] text-xs font-mono font-semibold uppercase tracking-wider text-[#A1A1AA] hover:bg-[#1C1C20] hover:text-white hover:border-[#D97706] rounded-none cursor-pointer transition-colors"
          >
            <FileText size={13} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button
            onClick={() => handleExportPlaceholder('Excel')}
            className="flex items-center gap-2 h-9 px-3 bg-[#111111] border border-[#2C2C2C] text-xs font-mono font-semibold uppercase tracking-wider text-[#A1A1AA] hover:bg-[#1C1C20] hover:text-white hover:border-[#D97706] rounded-none cursor-pointer transition-colors"
          >
            <FileSpreadsheet size={13} />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-2 h-9 px-3 bg-[#D97706] border border-[#D97706] text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-[#B45309] rounded-none cursor-pointer transition-colors"
          >
            <Sparkles size={13} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Global filters */}
      <ReportFilters
        vehicles={vehicles}
        drivers={drivers}
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        selectedDriver={selectedDriver}
        setSelectedDriver={setSelectedDriver}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedFuelType={selectedFuelType}
        setSelectedFuelType={setSelectedFuelType}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        onReset={handleResetFilters}
      />

      {/* Skeletons loader */}
      {isLoading ? (
        <SkeletonLoader variant="cards" count={12} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 w-full">
          <KpiCard title="Total Trips" value={totalTrips} icon={Calendar} subtitle="Dispatched logs" trend={{ value: '+4.2%', isPositive: true }} sparklineData={[42, 45, 48, 44, 49, 52]} />
          <KpiCard title="Completed Trips" value={completedTrips} icon={ClipboardCheck} subtitle="Delivered cargo" trend={{ value: '+5.1%', isPositive: true }} sparklineData={[38, 41, 44, 40, 45, 48]} />
          <KpiCard title="Cancelled Runs" value={cancelledTrips} icon={ShieldAlert} subtitle="Aborted journeys" trend={{ value: '-8.5%', isPositive: true }} sparklineData={[4, 3, 5, 2, 4, 3]} />
          <KpiCard title="Utilization" value={`${fleetUtilization}%`} icon={Truck} subtitle="Active deployment" trend={{ value: '+1.5%', isPositive: true }} sparklineData={[76, 81, 79, 83, 84, 87]} />
          <KpiCard title="Availability" value={`${vehicleAvailability}%`} icon={Settings} subtitle="Yard ready count" trend={{ value: '-2.1%', isPositive: false }} sparklineData={[82, 80, 81, 78, 79, 79]} />
          <KpiCard title="Avg Distance" value={`${avgTripDistance.toFixed(0)} km`} icon={TrendingUp} subtitle="Per route average" sparklineData={[340, 350, 360, 345, 365, 370]} />
          <KpiCard title="Avg Fuel Econ" value={`${avgEfficiency.toFixed(2)} km/L`} icon={Sparkles} subtitle="Fleet average efficiency" trend={{ value: '+2.1%', isPositive: true }} sparklineData={[5.1, 5.2, 5.0, 5.2, 5.3, 5.4]} />
          <KpiCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={DollarSign} subtitle="Earned invoices" trend={{ value: '+8.4%', isPositive: true }} sparklineData={[240, 290, 275, 310, 340, 380]} />
          <KpiCard title="Operating Cost" value={`₹${operatingCost.toLocaleString()}`} icon={DollarSign} subtitle="Fuel and expense bills" trend={{ value: '+3.2%', isPositive: false }} sparklineData={[110, 135, 128, 154, 168, 192]} />
          <KpiCard title="Net Profit" value={`₹${netProfit.toLocaleString()}`} icon={DollarSign} subtitle="Clear earnings" trend={{ value: '+11.2%', isPositive: true }} sparklineData={[130, 155, 147, 156, 172, 188]} />
          <KpiCard title="Maintenance Out" value={`₹${maintenanceCost.toLocaleString()}`} icon={Settings} subtitle="Garage expenses" trend={{ value: '-4.5%', isPositive: true }} sparklineData={[32, 28, 35, 29, 31, 30]} />
          <KpiCard title="Driver Score" value={`${avgDriverScore.toFixed(0)}/100`} icon={Users} subtitle="Avg performance index" trend={{ value: '+0.8%', isPositive: true }} sparklineData={[85, 87, 86, 88, 87, 88]} />
        </div>
      )}

      {/* Tabs navigation panel restricted by RBAC */}
      <div className="flex border-b border-[#2C2C2C] text-xs font-mono font-bold select-none uppercase mt-3">
        {availableTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-3 cursor-pointer border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab 
                ? "border-[#D97706] text-white bg-[#111111]" 
                : "border-transparent text-gray-500 hover:text-white"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {!isLoading && (
        <div className="flex flex-col gap-6">
          {activeTab === 'Overview' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AnalyticsChart fuelLogs={filteredFuelLogs} expenses={filteredExpenses} trips={filteredTrips} vehicles={vehicles} drivers={drivers} />
                </div>
                <div>
                  <ExecutiveInsight />
                </div>
              </div>
              <ExportPanel />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VehicleRankingTable rankings={vehicleRankings} />
                <DriverRankingTable rankings={driverRankings} />
              </div>
            </div>
          )}

          {activeTab === 'Operations & Heatmap' && (
            <div className="flex flex-col gap-6">
              <HeatMap />
              <TripAnalytics
                avgTripTime="4.5 hrs"
                avgTripDistance={avgTripDistance}
                tripsPerVehicle={totalTrips / (vehicles.length || 1)}
                tripsPerDriver={totalTrips / (drivers.length || 1)}
                onTimePercentage={94.5}
                cancelledTripsCount={cancelledTrips}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VehicleRankingTable rankings={vehicleRankings} />
                <DriverRankingTable rankings={driverRankings} />
              </div>
            </div>
          )}

          {activeTab === 'Finance & Fuel' && (
            <div className="flex flex-col gap-6">
              <FinancialSummary
                revenue={totalRevenue}
                expenses={operatingCost}
                maintenance={maintenanceCost}
                fuel={totalFuelCost}
                insurance={32000}
                driverCost={totalExpensesCost - maintenanceCost - 32000}
                profit={netProfit}
                costPerKm={costPerKm}
                avgRevPerTrip={avgRevPerTrip}
              />
              <FuelAnalytics
                avgMileage={avgMileage}
                highestConsumer="MH-12-PQ-4567"
                lowestEfficiency="KA-03-MX-1234 (4.50 km/L)"
                monthlyConsumption={filteredFuelLogs.reduce((acc, curr) => acc + curr.quantity, 0)}
                avgEfficiency={avgEfficiency}
              />
              <SavedReports reports={savedReports} />
            </div>
          )}

          {activeTab === 'Compliance & Maintenance' && (
            <div className="flex flex-col gap-6">
              <ComplianceReport compliances={filteredDriverCompliances} />
              <MaintenanceReport
                upcoming={2}
                overdue={1}
                emergency={1}
                completed={4}
                avgRepairTime="3.2 hrs"
              />
              <SavedReports reports={savedReports} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
