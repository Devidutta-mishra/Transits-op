import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import { mockFuelLogs } from '../mock/fuel';
import type { FuelLog } from '../mock/fuel';
import { mockExpenses } from '../mock/expenses';
import type { ExpenseRecord } from '../mock/expenses';
import { mockVehiclesData } from '../mock/vehicles';
import type { Vehicle } from '../mock/vehicles';
import { mockDriversData } from '../mock/drivers';
import type { Driver } from '../mock/drivers';
import { SummaryCard } from '../components/fuel/SummaryCard';
import { FuelTable } from '../components/fuel/FuelTable';
import { ExpenseTable } from '../components/fuel/ExpenseTable';
import { FuelForm } from '../components/fuel/FuelForm';
import { ExpenseForm } from '../components/fuel/ExpenseForm';
import { FuelDrawer } from '../components/fuel/FuelDrawer';
import { ExpenseDrawer } from '../components/fuel/ExpenseDrawer';
import { AnalyticsCharts } from '../components/fuel/AnalyticsCharts';
import { QuickInsights } from '../components/fuel/QuickInsights';
import { DeleteDialog } from '../components/fuel/DeleteDialog';
import { SkeletonLoader } from '../components/dashboard/SkeletonLoader';
import { EmptyState } from '../components/dashboard/EmptyState';
import { Badge } from '../components/ui/Badge';
import { ROLE_LABELS } from '../constants/permissions';
import { cn } from '../utils/cn';
import { 
  Fuel, Wallet, FileSpreadsheet, Printer, ChevronRight, 
  ChevronLeft, Plus, Search, RotateCcw, 
  Gauge, TrendingUp, Calendar, Info 
} from 'lucide-react';

export const FuelExpenseManagement: React.FC = () => {
  const { user } = useAuth();
  const { role } = usePermission();

  const [activeTab, setActiveTab] = useState<'fuel' | 'expenses'>('fuel');
  
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [vehicleFilter, setVehicleFilter] = useState<string>('');
  const [driverFilter, setDriverFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [selectedFuelLog, setSelectedFuelLog] = useState<FuelLog | null>(null);
  const [isFuelDrawerOpen, setIsFuelDrawerOpen] = useState<boolean>(false);
  const [isFuelFormOpen, setIsFormFuelOpen] = useState<boolean>(false);

  const [selectedExpense, setSelectedExpense] = useState<ExpenseRecord | null>(null);
  const [isExpenseDrawerOpen, setIsExpenseDrawerOpen] = useState<boolean>(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState<boolean>(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deleteType, setDeleteType] = useState<'fuel' | 'expense'>('fuel');
  const [itemToDeleteId, setItemToDeleteId] = useState<string>('');

  useEffect(() => {
    setFuelLogs(mockFuelLogs);
    setExpenses(mockExpenses);
    setVehicles(mockVehiclesData);
    setDrivers(mockDriversData);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!user || !role) return null;

  const handleResetFilters = () => {
    setSearchTerm('');
    setVehicleFilter('');
    setDriverFilter('');
    setCategoryFilter('');
    setFuelTypeFilter('');
    setDateFilter('');
    setSortBy('');
    setSortDirection('asc');
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleViewFuel = (log: FuelLog) => {
    setSelectedFuelLog(log);
    setIsFuelDrawerOpen(true);
  };

  const handleViewExpense = (exp: ExpenseRecord) => {
    setSelectedExpense(exp);
    setIsExpenseDrawerOpen(true);
  };

  const handleOpenDeleteFuel = (log: FuelLog) => {
    setDeleteType('fuel');
    setItemToDeleteId(log.logId);
    setIsDeleteOpen(true);
  };

  const handleOpenDeleteExpense = (exp: ExpenseRecord) => {
    setDeleteType('expense');
    setItemToDeleteId(exp.expenseId);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteType === 'fuel') {
      setFuelLogs(prev => prev.filter(l => l.logId !== itemToDeleteId));
    } else {
      setExpenses(prev => prev.filter(e => e.expenseId !== itemToDeleteId));
    }
    setIsDeleteOpen(false);
    setItemToDeleteId('');
  };

  const handleFuelSubmit = (data: FuelLog) => {
    setFuelLogs(prev => [data, ...prev]);
    setIsFormFuelOpen(false);
  };

  const handleExpenseSubmit = (data: ExpenseRecord) => {
    setExpenses(prev => [data, ...prev]);
    setIsExpenseFormOpen(false);
  };

  const handleApproveExpense = (exp: ExpenseRecord) => {
    setExpenses(prev => prev.map(e => e.expenseId === exp.expenseId ? { ...e, status: 'Approved', approvedBy: user.name } : e));
  };

  const handleRejectExpense = (exp: ExpenseRecord) => {
    setExpenses(prev => prev.map(e => e.expenseId === exp.expenseId ? { ...e, status: 'Rejected', approvedBy: user.name } : e));
  };

  const handlePayExpense = (exp: ExpenseRecord) => {
    setExpenses(prev => prev.map(e => e.expenseId === exp.expenseId ? { ...e, status: 'Paid', approvedBy: user.name } : e));
  };

  const handleExportCSV = () => {
    alert(`CSV_EXPORT_INITIATED // ${activeTab === 'fuel' ? fuelLogs.length : expenses.length} financial transactions written.`);
  };

  const handlePrint = () => {
    alert('PRINT_FINANCIAL_PAYLOAD // Spooling cost reports to dispatch yard printer...');
  };

  const filteredFuelLogs = fuelLogs.filter(l => {
    const matchSearch = l.logId.toLowerCase().includes(searchTerm.toLowerCase()) || l.fuelStation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchVehicle = !vehicleFilter || l.vehicleReg === vehicleFilter;
    const matchDriver = !driverFilter || l.driverId === driverFilter;
    const matchFuelType = !fuelTypeFilter || l.fuelType === fuelTypeFilter;
    const matchDate = !dateFilter || l.fuelDate === dateFilter;
    return matchSearch && matchVehicle && matchDriver && matchFuelType && matchDate;
  }).sort((a, b) => {
    if (!sortBy) return 0;
    
    let valA: any;
    let valB: any;

    if (sortBy === 'id') {
      valA = a.logId;
      valB = b.logId;
    } else if (sortBy === 'date') {
      valA = a.fuelDate;
      valB = b.fuelDate;
    } else if (sortBy === 'cost') {
      valA = a.totalCost;
      valB = b.totalCost;
    } else if (sortBy === 'odometer') {
      valA = a.currentOdometer;
      valB = b.currentOdometer;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredExpenses = expenses.filter(e => {
    if (e.archived) return false;
    const matchSearch = e.expenseId.toLowerCase().includes(searchTerm.toLowerCase()) || e.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchVehicle = !vehicleFilter || e.vehicleReg === vehicleFilter;
    const matchCategory = !categoryFilter || e.category === categoryFilter;
    const matchDate = !dateFilter || e.expenseDate === dateFilter;
    return matchSearch && matchVehicle && matchCategory && matchDate;
  }).sort((a, b) => {
    if (!sortBy) return 0;
    
    let valA: any;
    let valB: any;

    if (sortBy === 'id') {
      valA = a.expenseId;
      valB = b.expenseId;
    } else if (sortBy === 'date') {
      valA = a.expenseDate;
      valB = b.expenseDate;
    } else if (sortBy === 'amount') {
      valA = a.amount;
      valB = b.amount;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalFuelCost = fuelLogs.reduce((acc, curr) => acc + curr.totalCost, 0);
  const todayFuelCost = fuelLogs.filter(l => l.fuelDate === '2026-07-12').reduce((acc, curr) => acc + curr.totalCost, 0);
  const monthlyFuelCost = fuelLogs.filter(l => l.fuelDate.startsWith('2026-07')).reduce((acc, curr) => acc + curr.totalCost, 0);

  const approvedPaidExpenses = expenses.filter(e => e.status === 'Paid' || e.status === 'Approved');
  const totalOperationalExpense = approvedPaidExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const fuelEntriesCount = fuelLogs.length;
  const expenseRecordsCount = expenses.length;

  const validEfficiencyLogs = fuelLogs.filter(l => l.fuelEfficiency > 0);
  const avgEfficiency = validEfficiencyLogs.length > 0
    ? validEfficiencyLogs.reduce((acc, curr) => acc + curr.fuelEfficiency, 0) / validEfficiencyLogs.length
    : 0;

  const validMileageLogs = fuelLogs.filter(l => l.mileageSinceLastFill > 0);
  const avgMileage = validMileageLogs.length > 0
    ? validMileageLogs.reduce((acc, curr) => acc + curr.mileageSinceLastFill, 0) / validMileageLogs.length
    : 0;

  const paginatedFuelLogs = filteredFuelLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const currentCount = activeTab === 'fuel' ? filteredFuelLogs.length : filteredExpenses.length;
  const totalPages = Math.ceil(currentCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, currentCount);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const canAddFuel = role === 'FLEET_MANAGER' || role === 'FINANCIAL_ANALYST' || role === 'DISPATCHER';
  const canAddExpense = role === 'FLEET_MANAGER' || role === 'FINANCIAL_ANALYST';

  return (
    <div className="flex flex-col gap-6 text-left select-none font-sans">
      <div className="border-b border-[#2C2C2C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono tracking-widest uppercase">
            <span>Dashboard</span>
            <ChevronRight size={10} />
            <span>Finance</span>
            <ChevronRight size={10} />
            <span className="text-white">Fuel & Expenses</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white mt-1 leading-none">
            FUEL & EXPENSE MANAGEMENT
          </h1>
          <p className="text-[11px] text-gray-500 mt-2 font-mono tracking-wide">
            FLEET_COST_ACCOUNTING_CONSOLE // ENTRIES: {fuelEntriesCount + expenseRecordsCount}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border-r border-[#2C2C2C] pr-4 h-8 select-none">
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">CONSOLE_ACCESS:</span>
            <Badge variant="orange">{ROLE_LABELS[user.role]}</Badge>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 h-9 px-3 bg-[#111111] border border-[#2C2C2C] text-xs font-mono font-semibold uppercase tracking-wider text-[#A1A1AA] hover:bg-[#1C1C20] hover:text-white hover:border-[#D97706] rounded-none cursor-pointer transition-colors"
            >
              <FileSpreadsheet size={13} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 h-9 px-3 bg-[#111111] border border-[#2C2C2C] text-xs font-mono font-semibold uppercase tracking-wider text-[#A1A1AA] hover:bg-[#1C1C20] hover:text-white hover:border-[#D97706] rounded-none cursor-pointer transition-colors"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">Print</span>
            </button>
            {canAddFuel && (
              <button
                onClick={() => setIsFormFuelOpen(true)}
                className="flex items-center gap-2 h-9 px-3 bg-[#D97706] border border-[#D97706] text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-[#B45309] rounded-none cursor-pointer transition-colors"
              >
                <Fuel size={13} />
                <span>Log Fuel Entry</span>
              </button>
            )}
            {canAddExpense && (
              <button
                onClick={() => setIsExpenseFormOpen(true)}
                className="flex items-center gap-2 h-9 px-3 bg-zinc-800 border border-zinc-700 text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-[#1C1C20] hover:border-[#D97706] rounded-none cursor-pointer transition-colors"
              >
                <Plus size={13} />
                <span>Add Expense</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader variant="cards" count={8} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 w-full">
          <SummaryCard title="Total Fuel Cost" value={`₹${totalFuelCost.toLocaleString()}`} icon={Fuel} subtitle="All refueling costs" trend={{ value: '+5.4%', colorClass: 'text-red-500' }} />
          <SummaryCard title="Today's Fuel Cost" value={`₹${todayFuelCost.toLocaleString()}`} icon={Calendar} subtitle="Fuel entries today" />
          <SummaryCard title="Monthly Fuel" value={`₹${monthlyFuelCost.toLocaleString()}`} icon={TrendingUp} subtitle="July 2026 fuel cost" trend={{ value: '+8.2%', colorClass: 'text-red-500' }} />
          <SummaryCard title="Total Expenses" value={`₹${totalOperationalExpense.toLocaleString()}`} icon={Wallet} subtitle="Approved non-fuel costs" />
          <SummaryCard title="Fuel Entries" value={fuelEntriesCount} icon={Fuel} subtitle="Total refueling logs" />
          <SummaryCard title="Expense Records" value={expenseRecordsCount} icon={Wallet} subtitle="Total non-fuel bills" />
          <SummaryCard title="Avg Trip Mileage" value={`${avgMileage.toFixed(0)} km`} icon={Gauge} subtitle="Odo difference average" />
          <SummaryCard title="Avg Efficiency" value={`${avgEfficiency.toFixed(2)} km/L`} icon={Info} subtitle="Average fleet output" trend={{ value: '+2.1%', colorClass: 'text-green-500' }} />
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsCharts fuelLogs={fuelLogs} expenses={expenses} />
          </div>
          <div>
            <QuickInsights fuelLogs={fuelLogs} expenses={expenses} />
          </div>
        </div>
      )}

      {/* Database Modules tabs navigation */}
      <div className="flex border-b border-[#2C2C2C] text-xs font-mono font-bold select-none uppercase">
        <button
          onClick={() => {
            setActiveTab('fuel');
            setCurrentPage(1);
          }}
          className={cn(
            "px-6 py-3 cursor-pointer border-b-2 transition-colors",
            activeTab === 'fuel' 
              ? "border-[#D97706] text-white bg-[#111111]" 
              : "border-transparent text-gray-500 hover:text-white"
          )}
        >
          Fuel Refueling logs
        </button>
        <button
          onClick={() => {
            setActiveTab('expenses');
            setCurrentPage(1);
          }}
          className={cn(
            "px-6 py-3 cursor-pointer border-b-2 transition-colors",
            activeTab === 'expenses' 
              ? "border-[#D97706] text-white bg-[#111111]" 
              : "border-transparent text-gray-500 hover:text-white"
          )}
        >
          General expenses registry
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Dynamic Filters Bar */}
        <div className="flex flex-col gap-3 p-4 border border-[#2C2C2C] bg-[#111111] select-none font-mono text-xs text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH TRANSACTIONS..."
                className="w-full h-9 pl-9 pr-3 bg-[#0F0F10] border border-[#2C2C2C] text-[11px] text-white placeholder-gray-500 focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] rounded-none uppercase tracking-wider"
              />
            </div>

            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
            >
              <option value="">ALL VEHICLES</option>
              {vehicles.map(v => (
                <option key={v.registrationNumber} value={v.registrationNumber}>
                  {v.registrationNumber}
                </option>
              ))}
            </select>

            {activeTab === 'fuel' ? (
              <>
                <select
                  value={driverFilter}
                  onChange={(e) => setDriverFilter(e.target.value)}
                  className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
                >
                  <option value="">ALL DRIVERS</option>
                  {drivers.map(d => (
                    <option key={d.driverId} value={d.driverId}>
                      {d.fullName}
                    </option>
                  ))}
                </select>

                <select
                  value={fuelTypeFilter}
                  onChange={(e) => setFuelTypeFilter(e.target.value)}
                  className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
                >
                  <option value="">ALL FUEL TYPES</option>
                  <option value="Diesel">DIESEL</option>
                  <option value="Petrol">PETROL</option>
                  <option value="CNG">CNG</option>
                  <option value="Biofuel">BIOFUEL</option>
                </select>
              </>
            ) : (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
              >
                <option value="">ALL CATEGORIES</option>
                <option value="Fuel">FUEL</option>
                <option value="Repair">REPAIR</option>
                <option value="Maintenance">MAINTENANCE</option>
                <option value="Insurance">INSURANCE</option>
                <option value="Toll">TOLL</option>
                <option value="Parking">PARKING</option>
                <option value="Tyres">TYRES</option>
                <option value="Registration">REGISTRATION</option>
                <option value="Driver Allowance">DRIVER ALLOWANCE</option>
                <option value="Miscellaneous">MISCELLANEOUS</option>
              </select>
            )}

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full h-9 px-3 bg-[#0F0F10] border border-[#2C2C2C] text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] rounded-none uppercase tracking-wider"
            />

            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="h-9 w-full rounded-none border border-[#2C2C2C] bg-[#0F0F10] px-3 text-[11px] text-white focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] cursor-pointer appearance-none uppercase tracking-wider"
            >
              <option value="">SORT: DEFAULT</option>
              <option value="id">TRANSACTION ID</option>
              <option value="date">DATE</option>
              {activeTab === 'fuel' ? (
                <>
                  <option value="cost">TOTAL COST</option>
                  <option value="odometer">ODOMETER</option>
                </>
              ) : (
                <option value="amount">AMOUNT</option>
              )}
            </select>

            <button
              onClick={handleResetFilters}
              className="h-9 px-3 bg-[#1C1C20] border border-[#2C2C2C] hover:border-[#D97706] hover:bg-[#111111] transition-colors rounded-none flex items-center justify-center cursor-pointer text-[#A1A1AA] hover:text-white uppercase tracking-wider"
              title="Reset Filters"
            >
              <RotateCcw size={14} className="mr-2" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Dynamic Table Render */}
        {isLoading ? (
          <SkeletonLoader variant="table" />
        ) : activeTab === 'fuel' ? (
          paginatedFuelLogs.length === 0 ? (
            <EmptyState title="No Fuel Entries Found" description="There are no fuel logs recorded. Click Log Fuel Entry to start." />
          ) : (
            <FuelTable
              logs={paginatedFuelLogs}
              drivers={drivers}
              onView={handleViewFuel}
              onOpenDelete={handleOpenDeleteFuel}
              sortField={sortBy}
              sortDirection={sortDirection}
              onSort={handleSort}
              role={role}
            />
          )
        ) : (
          paginatedExpenses.length === 0 ? (
            <EmptyState title="No Expense Records Found" description="There are no expense logs recorded. Click Add Expense to start." />
          ) : (
            <ExpenseTable
              expenses={paginatedExpenses}
              onView={handleViewExpense}
              onApprove={handleApproveExpense}
              onReject={handleRejectExpense}
              onPay={handlePayExpense}
              onOpenDelete={handleOpenDeleteExpense}
              sortField={sortBy}
              sortDirection={sortDirection}
              onSort={handleSort}
              role={role}
            />
          )
        )}

        {/* Pagination Controls */}
        {!isLoading && currentCount > 0 && (
          <div className="border border-[#2C2C2C] bg-[#111111] px-4 py-3 flex items-center justify-between font-mono text-[11px] select-none uppercase tracking-wider text-gray-400">
            <div>
              Showing {startIndex + 1}–{endIndex} of {currentCount} Records
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-[#0F0F10] border border-[#2C2C2C] text-white px-2 py-1 rounded-none focus:outline-none focus:border-[#D97706] cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-[#2C2C2C] bg-[#0F0F10] hover:bg-[#1C1C20] disabled:opacity-30 disabled:hover:bg-transparent rounded-none cursor-pointer transition-colors text-white"
                >
                  <ChevronLeft size={14} />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-[#2C2C2C] bg-[#0F0F10] hover:bg-[#1C1C20] disabled:opacity-30 disabled:hover:bg-transparent rounded-none cursor-pointer transition-colors text-white"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Details drawers */}
      <FuelDrawer
        log={selectedFuelLog}
        isOpen={isFuelDrawerOpen}
        onClose={() => {
          setIsFuelDrawerOpen(false);
          setSelectedFuelLog(null);
        }}
        vehicles={vehicles}
        drivers={drivers}
      />

      <ExpenseDrawer
        expense={selectedExpense}
        isOpen={isExpenseDrawerOpen}
        onClose={() => {
          setIsExpenseDrawerOpen(false);
          setSelectedExpense(null);
        }}
        vehicles={vehicles}
      />

      {/* Forms modals */}
      <FuelForm
        isOpen={isFuelFormOpen}
        onClose={() => setIsFormFuelOpen(false)}
        onSubmit={handleFuelSubmit}
        existingLogs={fuelLogs}
        vehicles={vehicles}
        drivers={drivers}
      />

      <ExpenseForm
        isOpen={isExpenseFormOpen}
        onClose={() => setIsExpenseFormOpen(false)}
        onSubmit={handleExpenseSubmit}
        existingExpenses={expenses}
        vehicles={vehicles}
        currentUser={user.name}
      />

      {/* Delete ConfirmationDialog */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setItemToDeleteId('');
        }}
        onConfirm={handleConfirmDelete}
        title={deleteType === 'fuel' ? 'DELETE FUEL TRANSACTION' : 'DELETE EXPENSE RECORD'}
        message={
          deleteType === 'fuel'
            ? `Are you sure you want to permanently delete fuel entry ${itemToDeleteId}? This transaction will be permanently erased.`
            : `Are you sure you want to permanently delete expense record ${itemToDeleteId}? This record will be permanently erased.`
        }
      />
    </div>
  );
};
