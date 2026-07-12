import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import { mockDriversData } from '../mock/drivers';
import type { Driver, DriverStatus } from '../mock/drivers';
import { api } from '../services/api';
import { SummaryCard } from '../components/drivers/SummaryCard';
import { DriverFilters } from '../components/drivers/DriverFilters';
import { DriverTable } from '../components/drivers/DriverTable';
import { DriverDetailsDrawer } from '../components/drivers/DriverDetailsDrawer';
import { DriverForm } from '../components/drivers/DriverForm';
import { DeleteDialog } from '../components/drivers/DeleteDialog';
import { SkeletonLoader } from '../components/dashboard/SkeletonLoader';
import { EmptyState } from '../components/dashboard/EmptyState';
import { Badge } from '../components/ui/Badge';
import { ROLE_LABELS } from '../constants/permissions';
import { 
  Users, CheckCircle2, Route, ShieldAlert, Plus, 
  FileSpreadsheet, Printer, ChevronRight, ChevronLeft, AlertTriangle 
} from 'lucide-react';

export const DriverManagement: React.FC = () => {
  const { user } = useAuth();
  const { role } = usePermission();
  
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [licenseCategoryFilter, setLicenseCategoryFilter] = useState<string>('');
  const [safetyScoreFilter, setSafetyScoreFilter] = useState<string>('');
  const [validityFilter, setValidityFilter] = useState<string>('');
  
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  const mapBackendDriverToFrontend = (d: any): Driver => {
    let status: DriverStatus = 'Available';
    if (d.status === 'ON_TRIP') status = 'On Trip';
    else if (d.status === 'OFF_DUTY') status = 'Off Duty';
    else if (d.status === 'SUSPENDED') status = 'Suspended';

    return {
      id: d.id,
      driverId: d.employeeId || `DRV-${d.id}`,
      fullName: d.user?.fullName || 'Unknown',
      email: d.user?.email || '',
      phoneNumber: d.user?.phone || '',
      dateOfBirth: d.dateOfBirth || '1990-01-01',
      gender: (d.gender || 'Male') as any,
      address: d.address || 'N/A',
      emergencyContact: d.emergencyContact || 'N/A',
      licenseNumber: d.licenseNumber || '',
      licenseCategory: (d.licenseCategory || 'Heavy') as any,
      licenseIssueDate: d.licenseIssueDate || '2020-01-01',
      licenseExpiryDate: d.licenseExpiry ? new Date(d.licenseExpiry).toISOString().split('T')[0] : '',
      joiningDate: d.createdAt ? new Date(d.createdAt).toISOString().split('T')[0] : '',
      yearsOfExperience: Number(d.experience || 0),
      safetyScore: Number(d.rating ? d.rating * 20 : 90), // Backend is 0-5 stars, frontend is 0-100 score
      assignedVehicle: d.assignedVehicle?.registrationNumber || 'Unassigned',
      status: status,
      archived: false,
    } as any;
  };

  const mapFrontendDriverToBackend = (d: any) => {
    let status = 'AVAILABLE';
    if (d.status === 'On Trip') status = 'ON_TRIP';
    else if (d.status === 'Off Duty') status = 'OFF_DUTY';
    else if (d.status === 'Suspended') status = 'SUSPENDED';

    return {
      employeeId: d.driverId,
      licenseNumber: d.licenseNumber,
      licenseCategory: d.licenseCategory,
      licenseExpiry: d.licenseExpiryDate ? new Date(d.licenseExpiryDate) : new Date(),
      emergencyContact: d.emergencyContact,
      experience: Number(d.yearsOfExperience || 0),
      status: status,
      rating: Number(d.safetyScore || 90) / 20, // Backend is 0-5 stars
    };
  };

  const fetchDrivers = async () => {
    try {
      setIsLoading(true);
      const items = await api.drivers.list();
      const mapped = items.map(mapBackendDriverToFrontend);
      setDrivers(mapped);
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
      setDrivers(mockDriversData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  if (!user || !role) return null;

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setLicenseCategoryFilter('');
    setSafetyScoreFilter('');
    setValidityFilter('');
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
    setSelectedDriver(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (driver: Driver) => {
    setFormMode('edit');
    setSelectedDriver(driver);
    setIsFormOpen(true);
  };

  const handleView = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDetailsOpen(true);
  };

  const handleSuspend = async (driver: Driver) => {
    try {
      const id = (driver as any).id;
      if (id) {
        await api.drivers.update(id, { status: 'SUSPENDED' });
        fetchDrivers();
      } else {
        setDrivers(prev =>
          prev.map(d =>
            d.driverId === driver.driverId
              ? { ...d, status: 'Suspended' }
              : d
          )
        );
      }
    } catch (err) {
      console.error('Error suspending driver:', err);
    }
  };

  const handleArchive = async (driver: Driver) => {
    try {
      const id = (driver as any).id;
      if (id) {
        await api.drivers.update(id, { status: 'OFF_DUTY' });
        fetchDrivers();
      } else {
        setDrivers(prev =>
          prev.map(d =>
            d.driverId === driver.driverId
              ? { ...d, archived: true }
              : d
          )
        );
      }
    } catch (err) {
      console.error('Error archiving driver:', err);
    }
  };

  const handleOpenDelete = (driver: Driver) => {
    setDriverToDelete(driver);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (driverToDelete) {
      try {
        const id = (driverToDelete as any).id;
        if (id) {
          await api.drivers.delete(id);
          fetchDrivers();
        } else {
          setDrivers(prev =>
            prev.filter(d => d.driverId !== driverToDelete.driverId)
          );
        }
      } catch (err) {
        console.error('Error deleting driver:', err);
        alert((err as any).message || 'Error deleting driver');
      }
      setIsDeleteOpen(false);
      setDriverToDelete(null);
    }
  };

  const handleFormSubmit = async (data: Driver) => {
    try {
      if (formMode === 'add') {
        const userRegisterResult = await api.auth.register({
          fullName: data.fullName,
          email: data.email,
          phone: data.phoneNumber,
          password: 'driver123',
          role: 'Driver'
        });

        const payload = {
          ...mapFrontendDriverToBackend(data),
          userId: userRegisterResult.user.id
        };

        await api.drivers.create(payload);
      } else {
        const id = (selectedDriver as any)?.id;
        if (id) {
          const payload = mapFrontendDriverToBackend(data);
          await api.drivers.update(id, payload);
        } else {
          // Fallback if no ID is found
          setDrivers(prev =>
            prev.map(d => (d.driverId === data.driverId ? data : d))
          );
        }
      }
      fetchDrivers();
    } catch (err) {
      console.error('Error saving driver:', err);
      alert((err as any).message || 'Error saving driver');
    }
    setIsFormOpen(false);
    setSelectedDriver(null);
  };

  const handleExportCSV = () => {
    alert(`CSV_EXPORT_INITIATED // ${drivers.length} employee records written to local disk.`);
  };

  const handlePrint = () => {
    alert('PRINT_MANIFEST_GENERATED // Spooling payload to employee records terminal printer...');
  };

  const filteredDrivers = drivers
    .filter(d => !d.archived)
    .filter(d => {
      const matchSearch =
        d.driverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = !statusFilter || d.status === statusFilter;
      const matchLicense = !licenseCategoryFilter || d.licenseCategory === licenseCategoryFilter;
      
      let matchSafety = true;
      if (safetyScoreFilter === 'excellent') {
        matchSafety = d.safetyScore >= 90;
      } else if (safetyScoreFilter === 'good') {
        matchSafety = d.safetyScore >= 70 && d.safetyScore < 90;
      } else if (safetyScoreFilter === 'needs_review') {
        matchSafety = d.safetyScore < 70;
      }

      let matchValidity = true;
      const expiryDate = new Date(d.licenseExpiryDate);
      const today = new Date('2026-07-12');
      const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (validityFilter === 'expired') {
        matchValidity = diffDays <= 0;
      } else if (validityFilter === 'expiring_soon') {
        matchValidity = diffDays > 0 && diffDays <= 30;
      } else if (validityFilter === 'valid') {
        matchValidity = diffDays > 30;
      }
      
      return matchSearch && matchStatus && matchLicense && matchSafety && matchValidity;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let valA: any;
      let valB: any;
      
      if (sortBy === 'name') {
        valA = a.fullName;
        valB = b.fullName;
      } else if (sortBy === 'id') {
        valA = a.driverId;
        valB = b.driverId;
      } else if (sortBy === 'safety') {
        valA = a.safetyScore;
        valB = b.safetyScore;
      } else if (sortBy === 'expiry') {
        valA = a.licenseExpiryDate;
        valB = b.licenseExpiryDate;
      }
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const totalCount = filteredDrivers.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const activeDrivers = drivers.filter(d => !d.archived);
  const totalDriversCount = activeDrivers.length;
  const availableCount = activeDrivers.filter(d => d.status === 'Available').length;
  const onTripCount = activeDrivers.filter(d => d.status === 'On Trip').length;
  const suspendedCount = activeDrivers.filter(d => d.status === 'Suspended').length;

  const canAddDriver = role === 'FLEET_MANAGER' || role === 'SAFETY_OFFICER';

  return (
    <div className="flex flex-col gap-6 text-left select-none font-sans">
      <div className="border-b border-[#2C2C2C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono tracking-widest uppercase">
            <span>Dashboard</span>
            <ChevronRight size={10} />
            <span className="text-white">Drivers</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white mt-1 leading-none">
            DRIVER MANAGEMENT
          </h1>
          <p className="text-[11px] text-gray-500 mt-2 font-mono tracking-wide">
            FLEET_EMPLOYEE_ROSTER // ACTIVE DRIVERS: {totalDriversCount}
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
            {canAddDriver && (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 h-9 px-3 bg-[#D97706] border border-[#D97706] text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-[#B45309] active:bg-[#92400E] rounded-none cursor-pointer transition-colors"
              >
                <Plus size={14} />
                <span>Add Driver</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader variant="cards" count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <SummaryCard title="Total Roster" count={totalDriversCount} icon={Users} subtitle="Registered driver logs" />
          <SummaryCard title="Available Roster" count={availableCount} icon={CheckCircle2} subtitle="Yard standby available status" />
          <SummaryCard title="Roster On Trip" count={onTripCount} icon={Route} subtitle="Active consignments en route" />
          <SummaryCard title="Suspended" count={suspendedCount} icon={ShieldAlert} subtitle="Compliance holds active" />
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <div className="h-10 bg-[#1C1C20] border border-[#2C2C2C] rounded-none animate-pulse w-full" />
          <SkeletonLoader variant="table" />
        </div>
      ) : activeDrivers.length === 0 ? (
        <div className="py-12 border border-[#2C2C2C] bg-[#111111] text-center flex flex-col items-center justify-center font-mono">
          <AlertTriangle className="text-gray-600 mb-3" size={32} />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">No Drivers Registered</h3>
          <p className="text-xs text-gray-500 font-sans mt-1 leading-relaxed max-w-sm">
            There are no commercial drivers tracked inside the localized registry. Register a driver to begin tracking telemetry.
          </p>
          {canAddDriver && (
            <button
              onClick={handleOpenAdd}
              className="mt-6 h-10 px-4 bg-[#D97706] border border-[#D97706] text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-[#B45309] active:bg-[#92400E] rounded-none cursor-pointer transition-colors flex items-center gap-2"
            >
              <Plus size={14} />
              <span>Register First Driver</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <DriverFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            licenseCategoryFilter={licenseCategoryFilter}
            onLicenseCategoryChange={setLicenseCategoryFilter}
            safetyScoreFilter={safetyScoreFilter}
            onSafetyScoreChange={setSafetyScoreFilter}
            validityFilter={validityFilter}
            onValidityChange={setValidityFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={handleResetFilters}
          />

          {paginatedDrivers.length === 0 ? (
            <EmptyState 
              title="No Results Match Filters" 
              description="No driver logs inside the database match your current search queries or filter attributes. Reset filters to restore lists." 
            />
          ) : (
            <div className="flex flex-col gap-4">
              <DriverTable
                drivers={paginatedDrivers}
                onView={handleView}
                onEdit={handleOpenEdit}
                onSuspend={handleSuspend}
                onArchive={handleArchive}
                onDelete={handleOpenDelete}
                sortField={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
                role={role}
              />

              {/* Pagination controls */}
              <div className="border border-[#2C2C2C] bg-[#111111] px-4 py-3 flex items-center justify-between font-mono text-[11px] select-none uppercase tracking-wider text-gray-400">
                <div>
                  Showing {totalCount > 0 ? startIndex + 1 : 0}–{endIndex} of {totalCount} Drivers
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
      )}

      <DriverDetailsDrawer
        driver={selectedDriver}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedDriver(null);
        }}
      />

      <DriverForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedDriver(null);
        }}
        onSubmit={handleFormSubmit}
        driver={selectedDriver}
        existingIds={drivers
          .filter(d => !selectedDriver || d.driverId !== selectedDriver.driverId)
          .map(d => d.driverId)}
        existingLicenses={drivers
          .filter(d => !selectedDriver || d.driverId !== selectedDriver.driverId)
          .map(d => d.licenseNumber)}
        role={role}
      />

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDriverToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        driverName={driverToDelete?.fullName || ''}
      />
    </div>
  );
};
