import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import { mockMaintenanceData, mockRecentActivities } from '../mock/maintenance';
import type { MaintenanceJob, RecentActivityEvent, MaintenanceStatus } from '../mock/maintenance';
import { mockVehiclesData } from '../mock/vehicles';
import type { Vehicle } from '../mock/vehicles';
import { SummaryCard } from '../components/maintenance/SummaryCard';
import { MaintenanceFilters } from '../components/maintenance/MaintenanceFilters';
import { MaintenanceTable } from '../components/maintenance/MaintenanceTable';
import { MaintenanceDrawer } from '../components/maintenance/MaintenanceDrawer';
import { MaintenanceForm } from '../components/maintenance/MaintenanceForm';
import { BreakdownForm } from '../components/maintenance/BreakdownForm';
import { MaintenanceCalendar } from '../components/maintenance/MaintenanceCalendar';
import { MaintenanceChart } from '../components/maintenance/MaintenanceChart';
import { RecentActivity } from '../components/maintenance/RecentActivity';
import { DeleteDialog } from '../components/maintenance/DeleteDialog';
import { SkeletonLoader } from '../components/dashboard/SkeletonLoader';
import { EmptyState } from '../components/dashboard/EmptyState';
import { Badge } from '../components/ui/Badge';
import { ROLE_LABELS } from '../constants/permissions';
import { 
  Wrench, AlertOctagon, FileSpreadsheet, Printer, 
  ChevronRight, ChevronLeft, Calendar, CheckCircle2, AlertTriangle, Plus 
} from 'lucide-react';

export const MaintenanceManagement: React.FC = () => {
  const { user } = useAuth();
  const { role } = usePermission();

  const [jobs, setJobs] = useState<MaintenanceJob[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activities, setActivities] = useState<RecentActivityEvent[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [vehicleFilter, setVehicleFilter] = useState<string>('');
  const [priorityFilter, setTypePriorityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [mechanicFilter, setMechanicFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [selectedJob, setSelectedJob] = useState<MaintenanceJob | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  
  const [isBreakdownOpen, setIsBreakdownOpen] = useState<boolean>(false);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [jobToDelete, setJobToDelete] = useState<MaintenanceJob | null>(null);

  useEffect(() => {
    setJobs(mockMaintenanceData);
    setVehicles(mockVehiclesData);
    setActivities(mockRecentActivities);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!user || !role) return null;

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setVehicleFilter('');
    setTypePriorityFilter('');
    setStatusFilter('');
    setMechanicFilter('');
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

  const handleOpenAdd = () => {
    setFormMode('add');
    setSelectedJob(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (job: MaintenanceJob) => {
    setFormMode('edit');
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const handleView = (job: MaintenanceJob) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const syncVehicleStatus = (vehicleReg: string, status: MaintenanceStatus) => {
    const isOutOfService = status === 'In Progress' || status === 'Waiting Parts' || status === 'Overdue';
    const isReturned = status === 'Completed' || status === 'Cancelled';
    
    if (isOutOfService) {
      setVehicles(prev => prev.map(v => v.registrationNumber === vehicleReg ? { ...v, status: 'Maintenance' } : v));
    } else if (isReturned) {
      setVehicles(prev => prev.map(v => v.registrationNumber === vehicleReg ? { ...v, status: 'Available' } : v));
    }
  };

  const handleTransitionStatus = (job: MaintenanceJob, newStatus: MaintenanceStatus) => {
    const updatedJob = { ...job, status: newStatus };
    if (newStatus === 'Completed') {
      updatedJob.completionDate = new Date().toISOString().split('T')[0];
      updatedJob.actualCost = job.estimatedCost;
    }

    setJobs(prev => prev.map(j => j.jobId === job.jobId ? updatedJob : j));
    syncVehicleStatus(job.vehicleReg, newStatus);

    if (newStatus === 'Completed') {
      const newEvent: RecentActivityEvent = {
        id: `ACT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        eventType: 'Completed',
        message: `Job ${job.jobId} marked Completed. Vehicle ${job.vehicleReg} returned to Available status.`,
      };
      setActivities(prev => [newEvent, ...prev]);
    }
  };

  const handleArchive = (job: MaintenanceJob) => {
    setJobs(prev => prev.map(j => j.jobId === job.jobId ? { ...j, archived: true } : j));
  };

  const handleOpenDelete = (job: MaintenanceJob) => {
    setJobToDelete(job);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (jobToDelete) {
      setJobs(prev => prev.filter(j => j.jobId !== jobToDelete.jobId));
      setIsDeleteOpen(false);
      setJobToDelete(null);
    }
  };

  const handleFormSubmit = (data: MaintenanceJob) => {
    if (formMode === 'add') {
      setJobs(prev => [data, ...prev]);
      syncVehicleStatus(data.vehicleReg, data.status);
      
      const newEvent: RecentActivityEvent = {
        id: `ACT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        eventType: 'Scheduled',
        message: `New maintenance job ${data.jobId} scheduled for vehicle ${data.vehicleReg}.`,
      };
      setActivities(prev => [newEvent, ...prev]);
    } else {
      const oldJob = jobs.find(j => j.jobId === data.jobId);
      setJobs(prev => prev.map(j => (j.jobId === data.jobId ? data : j)));
      
      if (oldJob) {
        if (oldJob.vehicleReg !== data.vehicleReg || oldJob.status !== data.status) {
          syncVehicleStatus(oldJob.vehicleReg, 'Cancelled');
          syncVehicleStatus(data.vehicleReg, data.status);
        }
      }
    }
    setIsFormOpen(false);
    setSelectedJob(null);
  };

  const handleReportBreakdown = (data: {
    vehicleReg: string;
    location: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
  }) => {
    let copyIndex = 1;
    let newJobId = `MNT-2026-BD${copyIndex}`;
    while (jobs.some(j => j.jobId.toLowerCase() === newJobId.toLowerCase())) {
      copyIndex++;
      newJobId = `MNT-2026-BD${copyIndex}`;
    }

    const emergencyJob: MaintenanceJob = {
      jobId: newJobId,
      vehicleReg: data.vehicleReg,
      maintenanceType: 'Breakdown',
      priority: data.severity === 'Critical' ? 'Critical' : 'High',
      assignedMechanic: 'On Call Duty',
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedCost: 15000,
      estimatedDuration: 8,
      description: `[Location: ${data.location}] ${data.description}`,
      requiredParts: [],
      status: 'In Progress',
      archived: false,
    };

    setJobs(prev => [emergencyJob, ...prev]);
    
    setVehicles(prev => prev.map(v => v.registrationNumber === data.vehicleReg ? { ...v, status: 'Maintenance' } : v));

    const newEvent: RecentActivityEvent = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: 'Breakdown',
      message: `Emergency breakdown reported for ${data.vehicleReg} at ${data.location}. Job ${newJobId} created.`,
    };
    setActivities(prev => [newEvent, ...prev]);

    setIsBreakdownOpen(false);
  };

  const handleExportCSV = () => {
    alert(`CSV EXPORT INITIATED // ${jobs.length} maintenance logs written to local disc.`);
  };

  const handlePrint = () => {
    alert('PRINT SCHEDULER GENERATED // Spooling preventive calendars to fleet yard printer...');
  };

  const filteredJobs = jobs.filter(j => {
    if (j.archived) return false;
    const matchSearch = j.jobId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = !typeFilter || j.maintenanceType === typeFilter;
    const matchVehicle = !vehicleFilter || j.vehicleReg === vehicleFilter;
    const matchPriority = !priorityFilter || j.priority === priorityFilter;
    const matchStatus = !statusFilter || j.status === statusFilter;
    const matchMechanic = !mechanicFilter || j.assignedMechanic.toLowerCase() === mechanicFilter.toLowerCase();
    const matchDate = !dateFilter || j.scheduledDate === dateFilter;

    return matchSearch && matchType && matchVehicle && matchPriority && matchStatus && matchMechanic && matchDate;
  }).sort((a, b) => {
    if (!sortBy) return 0;
    
    let valA: any;
    let valB: any;

    if (sortBy === 'id') {
      valA = a.jobId;
      valB = b.jobId;
    } else if (sortBy === 'date') {
      valA = a.scheduledDate;
      valB = b.scheduledDate;
    } else if (sortBy === 'cost') {
      valA = a.estimatedCost;
      valB = b.estimatedCost;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalCount = filteredJobs.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const totalJobsCount = jobs.length;
  const scheduledCount = jobs.filter(j => j.status === 'Scheduled').length;
  const inProgressCount = jobs.filter(j => j.status === 'In Progress').length;
  const completedCount = jobs.filter(j => j.status === 'Completed').length;
  const emergencyCount = jobs.filter(j => j.maintenanceType === 'Breakdown').length;
  const outOfServiceCount = vehicles.filter(v => v.status === 'Maintenance').length;

  const uniqueMechanics = Array.from(new Set(jobs.map(j => j.assignedMechanic)));

  const mockChartData = [
    { month: 'Feb', preventive: 12000, corrective: 8000, breakdown: 15000 },
    { month: 'Mar', preventive: 15000, corrective: 12000, breakdown: 8000 },
    { month: 'Apr', preventive: 18000, corrective: 9500, breakdown: 24000 },
    { month: 'May', preventive: 14000, corrective: 16000, breakdown: 12000 },
    { month: 'Jun', preventive: 22000, corrective: 11000, breakdown: 19000 },
    { month: 'Jul', preventive: 25000, corrective: 15000, breakdown: 35000 },
  ];

  const canModify = role === 'FLEET_MANAGER' || role === 'SAFETY_OFFICER';

  return (
    <div className="flex flex-col gap-6 text-left select-none font-sans">
      <div className="border-b border-[#2C2C2C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono tracking-widest uppercase">
            <span>Dashboard</span>
            <ChevronRight size={10} />
            <span>Fleet</span>
            <ChevronRight size={10} />
            <span className="text-white">Maintenance</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white mt-1 leading-none">
            MAINTENANCE MANAGEMENT
          </h1>
          <p className="text-[11px] text-gray-500 mt-2 font-mono tracking-wide">
            FLEET MAINTENANCE LOG CONSOLE // RECORDS: {totalJobsCount}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border-r border-[#2C2C2C] pr-4 h-8 select-none">
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">CONSOLE ACCESS:</span>
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
            {canModify && (
              <>
                <button
                  onClick={() => setIsBreakdownOpen(true)}
                  className="flex items-center gap-2 h-9 px-3 bg-red-950/20 border border-red-800 text-xs font-mono font-semibold uppercase tracking-wider text-red-500 hover:bg-red-900/30 hover:border-red-600 rounded-none cursor-pointer transition-colors"
                >
                  <AlertOctagon size={13} />
                  <span>Report Breakdown</span>
                </button>
                <button
                  onClick={handleOpenAdd}
                  className="flex items-center gap-2 h-9 px-3 bg-[#D97706] border border-[#D97706] text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-[#B45309] rounded-none cursor-pointer transition-colors"
                >
                  <Wrench size={13} />
                  <span>Schedule Job</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader variant="cards" count={6} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          <SummaryCard title="Total Jobs" count={totalJobsCount} icon={Wrench} subtitle="Maintenance sheets registered" />
          <SummaryCard title="Scheduled" count={scheduledCount} icon={Calendar} subtitle="Preventive service tasks pending" />
          <SummaryCard title="In Progress" count={inProgressCount} icon={Wrench} subtitle="Active workshop services" />
          <SummaryCard title="Completed" count={completedCount} icon={CheckCircle2} subtitle="Closed manifests history" />
          <SummaryCard title="Emergency Repairs" count={emergencyCount} icon={AlertOctagon} subtitle="Emergency breakdown jobs" />
          <SummaryCard title="Out Of Service" count={outOfServiceCount} icon={AlertTriangle} subtitle="Vehicles currently in workshop" />
        </div>
      )}

      {/* Analytics Charts & Activity Feeds */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MaintenanceChart data={mockChartData} />
          </div>
          <div>
            <RecentActivity activities={activities} />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <div className="h-10 bg-[#1C1C20] border border-[#2C2C2C] rounded-none animate-pulse w-full" />
          <SkeletonLoader variant="table" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-12 border border-[#2C2C2C] bg-[#111111] text-center flex flex-col items-center justify-center font-mono">
          <AlertTriangle className="text-gray-600 mb-3" size={32} />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">No jobs found</h3>
          <p className="text-xs text-gray-500 font-sans mt-1 leading-relaxed max-w-sm">
            There are no maintenance tasks scheduled. Register a preventive service job to begin tracking logistics.
          </p>
          {canModify && (
            <button
              onClick={handleOpenAdd}
              className="mt-6 h-10 px-4 bg-[#D97706] border border-[#D97706] text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-[#B45309] rounded-none cursor-pointer transition-colors flex items-center gap-2"
            >
              <Plus size={14} />
              <span>Schedule Maintenance</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#2C2C2C] pb-2">
              <Wrench size={16} className="text-[#D97706]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Maintenance Manifest Archives
              </h2>
            </div>

            <MaintenanceFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
              vehicleFilter={vehicleFilter}
              onVehicleChange={setVehicleFilter}
              priorityFilter={priorityFilter}
              onPriorityChange={setTypePriorityFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              mechanicFilter={mechanicFilter}
              onMechanicChange={setMechanicFilter}
              dateFilter={dateFilter}
              onDateChange={setDateFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onReset={handleResetFilters}
              vehicles={vehicles}
              mechanics={uniqueMechanics}
            />

            {paginatedJobs.length === 0 ? (
              <EmptyState 
                title="No Maintenance Matches" 
                description="No manifest sheets match the selected filter combinations. Reset filter options to reload." 
              />
            ) : (
              <div className="flex flex-col gap-4">
                <MaintenanceTable
                  jobs={paginatedJobs}
                  onView={handleView}
                  onEdit={handleOpenEdit}
                  onComplete={(job) => handleTransitionStatus(job, 'Completed')}
                  onCancel={(job) => handleTransitionStatus(job, 'Cancelled')}
                  onArchive={handleArchive}
                  onOpenDelete={handleOpenDelete}
                  sortField={sortBy}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  role={role}
                />

                <div className="border border-[#2C2C2C] bg-[#111111] px-4 py-3 flex items-center justify-between font-mono text-[11px] select-none uppercase tracking-wider text-gray-400">
                  <div>
                    Showing {totalCount > 0 ? startIndex + 1 : 0}–{endIndex} of {totalCount} Records
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
              </div>
            )}
          </div>

          {/* Monthly calendar schedule */}
          <div className="mt-4">
            <MaintenanceCalendar jobs={jobs} onViewJob={handleView} />
          </div>
        </div>
      )}

      <MaintenanceDrawer
        job={selectedJob}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedJob(null);
        }}
        vehicles={vehicles}
      />

      <MaintenanceForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedJob(null);
        }}
        onSubmit={handleFormSubmit}
        job={selectedJob}
        existingJobIds={jobs
          .filter(j => !selectedJob || j.jobId !== selectedJob.jobId)
          .map(j => j.jobId)}
        vehicles={vehicles}
      />

      <BreakdownForm
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        onSubmit={handleReportBreakdown}
        vehicles={vehicles}
      />

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setJobToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        jobId={jobToDelete?.jobId || ''}
      />
    </div>
  );
};
