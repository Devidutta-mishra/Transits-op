import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import { mockTripsData } from '../mock/trips';
import type { Trip, TripStatus } from '../mock/trips';
import { mockVehiclesData } from '../mock/vehicles';
import type { Vehicle } from '../mock/vehicles';
import { mockDriversData } from '../mock/drivers';
import type { Driver } from '../mock/drivers';
import { SummaryCard } from '../components/trips/SummaryCard';
import { TripFilters } from '../components/trips/TripFilters';
import { TripTable } from '../components/trips/TripTable';
import { DispatchBoard } from '../components/trips/DispatchBoard';
import { TripDetailsDrawer } from '../components/trips/TripDetailsDrawer';
import { TripForm } from '../components/trips/TripForm';
import { ConfirmationDialog } from '../components/trips/ConfirmationDialog';
import { SkeletonLoader } from '../components/dashboard/SkeletonLoader';
import { EmptyState } from '../components/dashboard/EmptyState';
import { Badge } from '../components/ui/Badge';
import { ROLE_LABELS } from '../constants/permissions';
import { 
  ClipboardList, CheckCircle2, Navigation, AlertTriangle, 
  XCircle, Plus, FileSpreadsheet, Printer, ChevronRight, ChevronLeft, Calendar 
} from 'lucide-react';

export const TripManagement: React.FC = () => {
  const { user } = useAuth();
  const { role } = usePermission();
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [vehicleFilter, setVehicleFilter] = useState<string>('');
  const [driverFilter, setDriverFilter] = useState<string>('');
  const [originFilter, setOriginFilter] = useState<string>('');
  const [destinationFilter, setDestinationFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [isCancelOpen, setIsCancelOpen] = useState<boolean>(false);
  const [tripToCancel, setTripToCancel] = useState<Trip | null>(null);

  useEffect(() => {
    setTrips(mockTripsData);
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
    setStatusFilter('');
    setVehicleFilter('');
    setDriverFilter('');
    setOriginFilter('');
    setDestinationFilter('');
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
    setSelectedTrip(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (trip: Trip) => {
    setFormMode('edit');
    setSelectedTrip(trip);
    setIsFormOpen(true);
  };

  const handleView = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsDetailsOpen(true);
  };

  const syncResourceStatuses = (
    vehicleReg: string, 
    driverId: string, 
    status: TripStatus
  ) => {
    const isResourceActive = status === 'Dispatched' || status === 'In Transit';
    const isResourceFree = status === 'Completed' || status === 'Cancelled';
    
    if (isResourceActive) {
      setVehicles(prev => prev.map(v => v.registrationNumber === vehicleReg ? { ...v, status: 'On Trip' } : v));
      setDrivers(prev => prev.map(d => d.driverId === driverId ? { ...d, status: 'On Trip' } : d));
    } else if (isResourceFree) {
      setVehicles(prev => prev.map(v => v.registrationNumber === vehicleReg ? { ...v, status: 'Available' } : v));
      setDrivers(prev => prev.map(d => d.driverId === driverId ? { ...d, status: 'Available' } : d));
    }
  };

  const handleTransition = (trip: Trip, newStatus: TripStatus) => {
    let computedProgress = trip.progress;
    if (newStatus === 'Draft' || newStatus === 'Scheduled' || newStatus === 'Cancelled') {
      computedProgress = 0;
    } else if (newStatus === 'Dispatched') {
      computedProgress = 10;
    } else if (newStatus === 'In Transit') {
      computedProgress = 50;
    } else if (newStatus === 'Completed') {
      computedProgress = 100;
    }

    setTrips(prev =>
      prev.map(t =>
        t.tripId === trip.tripId
          ? { ...t, status: newStatus, progress: computedProgress }
          : t
      )
    );

    syncResourceStatuses(trip.assignedVehicle, trip.assignedDriver, newStatus);
  };

  const handleReassignDriver = (tripId: string, newDriverId: string) => {
    const trip = trips.find(t => t.tripId === tripId);
    if (!trip) return;

    const oldDriverId = trip.assignedDriver;

    setTrips(prev => prev.map(t => t.tripId === tripId ? { ...t, assignedDriver: newDriverId } : t));
    
    setDrivers(prev =>
      prev.map(d => {
        if (d.driverId === oldDriverId) return { ...d, status: 'Available' };
        if (d.driverId === newDriverId) return { ...d, status: 'On Trip' };
        return d;
      })
    );
  };

  const handleReassignVehicle = (tripId: string, newVehicleReg: string) => {
    const trip = trips.find(t => t.tripId === tripId);
    if (!trip) return;

    const oldVehicleReg = trip.assignedVehicle;

    setTrips(prev => prev.map(t => t.tripId === tripId ? { ...t, assignedVehicle: newVehicleReg } : t));
    
    setVehicles(prev =>
      prev.map(v => {
        if (v.registrationNumber === oldVehicleReg) return { ...v, status: 'Available' };
        if (v.registrationNumber === newVehicleReg) return { ...v, status: 'On Trip' };
        return v;
      })
    );
  };

  const handleDuplicate = (trip: Trip) => {
    let copyIndex = 1;
    let newTripId = `${trip.tripId}-CP${copyIndex}`;
    while (trips.some(t => t.tripId.toLowerCase() === newTripId.toLowerCase())) {
      copyIndex++;
      newTripId = `${trip.tripId}-CP${copyIndex}`;
    }

    const duplicatedTrip: Trip = {
      ...trip,
      tripId: newTripId,
      status: 'Draft',
      progress: 0,
      assignedDriver: '',
      assignedVehicle: '',
    };

    setTrips(prev => [duplicatedTrip, ...prev]);
  };

  const handleOpenCancel = (trip: Trip) => {
    setTripToCancel(trip);
    setIsCancelOpen(true);
  };

  const handleConfirmCancel = (reason: string) => {
    if (tripToCancel) {
      setTrips(prev =>
        prev.map(t =>
          t.tripId === tripToCancel.tripId
            ? { ...t, status: 'Cancelled', progress: 0, notes: reason ? `${t.notes}\n[Cancelled: ${reason}]` : t.notes }
            : t
        )
      );

      syncResourceStatuses(tripToCancel.assignedVehicle, tripToCancel.assignedDriver, 'Cancelled');
      setIsCancelOpen(false);
      setTripToCancel(null);
    }
  };

  const handleFormSubmit = (data: Trip) => {
    if (formMode === 'add') {
      setTrips(prev => [data, ...prev]);
      syncResourceStatuses(data.assignedVehicle, data.assignedDriver, data.status);
    } else {
      const oldTrip = trips.find(t => t.tripId === data.tripId);
      setTrips(prev => prev.map(t => (t.tripId === data.tripId ? data : t)));
      
      if (oldTrip) {
        if (oldTrip.assignedVehicle !== data.assignedVehicle || oldTrip.assignedDriver !== data.assignedDriver || oldTrip.status !== data.status) {
          syncResourceStatuses(oldTrip.assignedVehicle, oldTrip.assignedDriver, 'Cancelled');
          syncResourceStatuses(data.assignedVehicle, data.assignedDriver, data.status);
        }
      }
    }
    setIsFormOpen(false);
    setSelectedTrip(null);
  };

  const handleExportCSV = () => {
    alert(`CSV EXPORT INITIATED // ${trips.length} dispatch logs written to local disc.`);
  };

  const handlePrint = () => {
    alert('PRINT MANIFEST GENERATED // Spooling operational payloads to terminal dispatch printer...');
  };

  const filteredTrips = trips.filter(t => {
    const matchSearch = t.tripId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || t.status === statusFilter;
    const matchVehicle = !vehicleFilter || t.assignedVehicle === vehicleFilter;
    const matchDriver = !driverFilter || t.assignedDriver === driverFilter;
    
    const matchOrigin = !originFilter || t.origin.toLowerCase().includes(originFilter.toLowerCase());
    const matchDest = !destinationFilter || t.destination.toLowerCase().includes(destinationFilter.toLowerCase());
    const matchDate = !dateFilter || t.departureDate === dateFilter;

    return matchSearch && matchStatus && matchVehicle && matchDriver && matchOrigin && matchDest && matchDate;
  }).sort((a, b) => {
    if (!sortBy) return 0;
    
    let valA: any;
    let valB: any;

    if (sortBy === 'id') {
      valA = a.tripId;
      valB = b.tripId;
    } else if (sortBy === 'departure') {
      valA = a.departureDate;
      valB = b.departureDate;
    } else if (sortBy === 'distance') {
      valA = a.plannedDistance;
      valB = b.plannedDistance;
    } else if (sortBy === 'revenue') {
      valA = a.revenue;
      valB = b.revenue;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalCount = filteredTrips.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const paginatedTrips = filteredTrips.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const totalTripsCount = trips.length;
  const scheduledCount = trips.filter(t => t.status === 'Scheduled').length;
  const inProgressCount = trips.filter(t => t.status === 'Dispatched' || t.status === 'In Transit').length;
  const completedCount = trips.filter(t => t.status === 'Completed').length;
  const cancelledCount = trips.filter(t => t.status === 'Cancelled').length;
  const todayDispatchedCount = trips.filter(t => t.departureDate === '2026-07-12').length;

  const activeTransports = trips.filter(t => t.status === 'Dispatched' || t.status === 'In Transit');

  const canModifyOps = role === 'FLEET_MANAGER' || role === 'DISPATCHER';

  return (
    <div className="flex flex-col gap-6 text-left select-none font-sans">
      <div className="border-b border-[#2C2C2C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono tracking-widest uppercase">
            <span>Dashboard</span>
            <ChevronRight size={10} />
            <span>Operations</span>
            <ChevronRight size={10} />
            <span className="text-white">Trips</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white mt-1 leading-none">
            TRIP MANAGEMENT
          </h1>
          <p className="text-[11px] text-gray-500 mt-2 font-mono tracking-wide">
            OPERATIONS DISPATCH DATABASE // RECORDS: {totalTripsCount}
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
              className="flex items-center gap-2 h-9 px-3 bg-[#111111] border border-[#2C2C2C] text-xs font-mono font-semibold uppercase tracking-wider text-[#A1A1AA] hover:bg-[#1C1C20] hover:text-white hover:border-[#D97706] active:bg-[#121214] rounded-none cursor-pointer transition-colors"
            >
              <FileSpreadsheet size={13} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 h-9 px-3 bg-[#111111] border border-[#2C2C2C] text-xs font-mono font-semibold uppercase tracking-wider text-[#A1A1AA] hover:bg-[#1C1C20] hover:text-white hover:border-[#D97706] active:bg-[#121214] rounded-none cursor-pointer transition-colors"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">Print</span>
            </button>
            {canModifyOps && (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 h-9 px-3 bg-[#D97706] border border-[#D97706] text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-[#B45309] active:bg-[#92400E] rounded-none cursor-pointer transition-colors"
              >
                <Plus size={14} />
                <span>Create Trip</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader variant="cards" count={6} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          <SummaryCard title="Total Trips" count={totalTripsCount} icon={ClipboardList} subtitle="Active operational logs" />
          <SummaryCard title="Scheduled" count={scheduledCount} icon={Calendar} subtitle="Pending transits queued" />
          <SummaryCard title="In Progress" count={inProgressCount} icon={Navigation} subtitle="Assets en route tracking" />
          <SummaryCard title="Completed" count={completedCount} icon={CheckCircle2} subtitle="Closed manifests archives" />
          <SummaryCard title="Cancelled" count={cancelledCount} icon={XCircle} subtitle="Aborted logs record list" />
          <SummaryCard title="Today's Dispatches" count={todayDispatchedCount} icon={ClipboardList} subtitle="Manifest departures today" />
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <div className="h-10 bg-[#1C1C20] border border-[#2C2C2C] rounded-none animate-pulse w-full" />
          <SkeletonLoader variant="table" />
        </div>
      ) : trips.length === 0 ? (
        <div className="py-12 border border-[#2C2C2C] bg-[#111111] text-center flex flex-col items-center justify-center font-mono">
          <AlertTriangle className="text-gray-600 mb-3" size={32} />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">No Trips Found</h3>
          <p className="text-xs text-gray-500 font-sans mt-1 leading-relaxed max-w-sm">
            There are no operational routes scheduled inside the dispatch system. Register a cargo manifest trip to begin tracking logistics.
          </p>
          {canModifyOps && (
            <button
              onClick={handleOpenAdd}
              className="mt-6 h-10 px-4 bg-[#D97706] border border-[#D97706] text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-[#B45309] active:bg-[#92400E] rounded-none cursor-pointer transition-colors flex items-center gap-2"
            >
              <Plus size={14} />
              <span>Create First Trip</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Dispatch Board section at the top of lists */}
          <DispatchBoard
            activeTrips={activeTransports}
            vehicles={vehicles}
            drivers={drivers}
            onReassignDriver={handleReassignDriver}
            onReassignVehicle={handleReassignVehicle}
            onComplete={(t) => handleTransition(t, 'Completed')}
            onCancel={handleOpenCancel}
            onDuplicate={handleDuplicate}
            role={role}
          />

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#2C2C2C] pb-2">
              <ClipboardList size={16} className="text-[#D97706]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Dispatch Manifest Archive
              </h2>
            </div>
            
            <TripFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              vehicleFilter={vehicleFilter}
              onVehicleChange={setVehicleFilter}
              driverFilter={driverFilter}
              onDriverChange={setDriverFilter}
              originFilter={originFilter}
              onOriginChange={setOriginFilter}
              destinationFilter={destinationFilter}
              onDestinationChange={setDestinationFilter}
              dateFilter={dateFilter}
              onDateChange={setDateFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onReset={handleResetFilters}
              vehicles={vehicles}
              drivers={drivers}
            />

            {paginatedTrips.length === 0 ? (
              <EmptyState 
                title="No Dispatch Matches" 
                description="No manifest sheets match the selected filter combinations. Reset operations filters to reload." 
              />
            ) : (
              <div className="flex flex-col gap-4">
                <TripTable
                  trips={paginatedTrips}
                  drivers={drivers}
                  onView={handleView}
                  onEdit={handleOpenEdit}
                  onTransition={handleTransition}
                  onDuplicate={handleDuplicate}
                  onOpenCancel={handleOpenCancel}
                  sortField={sortBy}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  role={role}
                />

                <div className="border border-[#2C2C2C] bg-[#111111] px-4 py-3 flex items-center justify-between font-mono text-[11px] select-none uppercase tracking-wider text-gray-400">
                  <div>
                    Showing {totalCount > 0 ? startIndex + 1 : 0}–{endIndex} of {totalCount} Trips
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
        </div>
      )}

      <TripDetailsDrawer
        trip={selectedTrip}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedTrip(null);
        }}
        vehicles={vehicles}
        drivers={drivers}
      />

      <TripForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTrip(null);
        }}
        onSubmit={handleFormSubmit}
        trip={selectedTrip}
        existingTripIds={trips
          .filter(t => !selectedTrip || t.tripId !== selectedTrip.tripId)
          .map(t => t.tripId)}
        vehicles={vehicles}
        drivers={drivers}
      />

      <ConfirmationDialog
        isOpen={isCancelOpen}
        onClose={() => {
          setIsCancelOpen(false);
          setTripToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
        tripId={tripToCancel?.tripId || ''}
      />
    </div>
  );
};
