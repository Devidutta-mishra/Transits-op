import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import { mockVehiclesData } from '../mock/vehicles';
import type { Vehicle, VehicleStatus } from '../mock/vehicles';
import { api } from '../services/api';
import { SummaryCard } from '../components/fleet/SummaryCard';
import { VehicleFilters } from '../components/fleet/VehicleFilters';
import { VehicleTable } from '../components/fleet/VehicleTable';
import { VehicleDetailsDrawer } from '../components/fleet/VehicleDetailsDrawer';
import { VehicleForm } from '../components/fleet/VehicleForm';
import { DeleteDialog } from '../components/fleet/DeleteDialog';
import { SkeletonLoader } from '../components/dashboard/SkeletonLoader';
import { EmptyState } from '../components/dashboard/EmptyState';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ROLE_LABELS } from '../constants/permissions';
import { 
  Truck, CheckCircle2, Route, Wrench, Plus, 
  FileSpreadsheet, Printer, ChevronRight, ChevronLeft, AlertTriangle 
} from 'lucide-react';

export const VehicleRegistry: React.FC = () => {
  const { user } = useAuth();
  const { role } = usePermission();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('');
  
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const mapBackendVehicleToFrontend = (v: any): Vehicle => {
    let status: VehicleStatus = 'Available';
    if (v.status === 'ON_TRIP') status = 'On Trip';
    else if (v.status === 'IN_SHOP' || v.status === 'MAINTENANCE') status = 'Maintenance';
    else if (v.status === 'RETIRED') status = 'Retired';

    return {
      id: v.id,
      registrationNumber: v.registrationNumber,
      vehicleName: v.name || `${v.manufacturer || ''} ${v.model || ''}`.trim() || v.registrationNumber,
      vehicleType: (v.type || 'HGV') as any,
      manufacturer: v.manufacturer || 'Unknown',
      model: v.model || 'Unknown',
      modelYear: v.modelYear || 2022,
      maxLoadCapacity: Number(v.capacityKg || 0),
      currentOdometer: Number(v.currentOdometer || 0),
      acquisitionCost: Number(v.purchasePrice || 0),
      vinNumber: v.vinNumber || 'N/A',
      engineNumber: v.engineNumber || 'N/A',
      fuelType: (v.fuelType || 'Diesel') as any,
      purchaseDate: v.purchaseDate ? new Date(v.purchaseDate).toISOString().split('T')[0] : '',
      insuranceExpiry: v.insuranceExpiry ? new Date(v.insuranceExpiry).toISOString().split('T')[0] : '',
      registrationExpiry: v.registrationExpiry ? new Date(v.registrationExpiry).toISOString().split('T')[0] : '',
      assignedDriver: v.assignedDriver?.user?.fullName || '',
      status: status,
      region: (v.region || 'West') as any,
    } as any;
  };

  const mapFrontendVehicleToBackend = (v: any) => {
    let status = 'AVAILABLE';
    if (v.status === 'On Trip') status = 'ON_TRIP';
    else if (v.status === 'Maintenance') status = 'IN_SHOP';
    else if (v.status === 'Retired') status = 'RETIRED';

    return {
      registrationNumber: v.registrationNumber,
      name: v.vehicleName,
      type: v.vehicleType,
      manufacturer: v.manufacturer,
      model: v.model,
      modelYear: Number(v.modelYear || 2022),
      capacityKg: Number(v.maxLoadCapacity || 0),
      currentOdometer: Number(v.currentOdometer || 0),
      purchasePrice: Number(v.acquisitionCost || 0),
      vinNumber: v.vinNumber,
      engineNumber: v.engineNumber,
      fuelType: v.fuelType,
      purchaseDate: v.purchaseDate ? new Date(v.purchaseDate) : null,
      insuranceExpiry: v.insuranceExpiry ? new Date(v.insuranceExpiry) : null,
      registrationExpiry: v.registrationExpiry ? new Date(v.registrationExpiry) : null,
      status: status,
      region: v.region
    };
  };

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const items = await api.vehicles.list();
      const mapped = items.map(mapBackendVehicleToFrontend);
      setVehicles(mapped);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      setVehicles(mockVehiclesData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  if (!user || !role) return null;

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
    setRegionFilter('');
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
    setSelectedVehicle(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (vehicle: Vehicle) => {
    setFormMode('edit');
    setSelectedVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsOpen(true);
  };

  const handleArchive = async (vehicle: Vehicle) => {
    try {
      const id = (vehicle as any).id;
      if (id) {
        await api.vehicles.update(id, { status: 'RETIRED' });
        fetchVehicles();
      } else {
        setVehicles(prev =>
          prev.map(v =>
            v.registrationNumber === vehicle.registrationNumber
              ? { ...v, status: 'Retired' }
              : v
          )
        );
      }
    } catch (err) {
      console.error('Error archiving vehicle:', err);
    }
  };

  const handleDuplicate = async (vehicle: Vehicle) => {
    try {
      let copyIndex = 1;
      let newRegNumber = `${vehicle.registrationNumber}-C${copyIndex}`;
      while (vehicles.some(v => v.registrationNumber.toLowerCase() === newRegNumber.toLowerCase())) {
        copyIndex++;
        newRegNumber = `${vehicle.registrationNumber}-C${copyIndex}`;
      }

      const duplicatedPayload = mapFrontendVehicleToBackend({
        ...vehicle,
        registrationNumber: newRegNumber,
        vehicleName: `${vehicle.vehicleName} (Copy)`,
        vinNumber: `VIN${Math.random().toString(36).substring(2, 17).toUpperCase()}`,
        engineNumber: `ENG${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        status: 'Available',
      });

      await api.vehicles.create(duplicatedPayload);
      fetchVehicles();
    } catch (err) {
      console.error('Error duplicating vehicle:', err);
      
      let copyIndex = 1;
      let newRegNumber = `${vehicle.registrationNumber}-C${copyIndex}`;
      while (vehicles.some(v => v.registrationNumber.toLowerCase() === newRegNumber.toLowerCase())) {
        copyIndex++;
        newRegNumber = `${vehicle.registrationNumber}-C${copyIndex}`;
      }
      const duplicatedVehicle: Vehicle = {
        ...vehicle,
        registrationNumber: newRegNumber,
        vehicleName: `${vehicle.vehicleName} (Copy)`,
        vinNumber: `VIN${Math.random().toString(36).substring(2, 17).toUpperCase()}`,
        engineNumber: `ENG${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        status: 'Available',
      };
      setVehicles(prev => [duplicatedVehicle, ...prev]);
    }
  };

  const handleOpenDelete = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (vehicleToDelete) {
      try {
        const id = (vehicleToDelete as any).id;
        if (id) {
          await api.vehicles.delete(id);
          fetchVehicles();
        } else {
          setVehicles(prev =>
            prev.filter(v => v.registrationNumber !== vehicleToDelete.registrationNumber)
          );
        }
      } catch (err) {
        console.error('Error deleting vehicle:', err);
        alert((err as any).message || 'Error deleting vehicle');
      }
      setIsDeleteOpen(false);
      setVehicleToDelete(null);
    }
  };

  const handleFormSubmit = async (data: Vehicle) => {
    try {
      const payload = mapFrontendVehicleToBackend(data);
      if (formMode === 'add') {
        await api.vehicles.create(payload);
      } else {
        const id = (selectedVehicle as any)?.id;
        if (id) {
          await api.vehicles.update(id, payload);
        } else {
          // Fallback if no ID is found
          setVehicles(prev =>
            prev.map(v => (v.registrationNumber === data.registrationNumber ? data : v))
          );
        }
      }
      fetchVehicles();
    } catch (err) {
      console.error('Error saving vehicle:', err);
      alert((err as any).message || 'Error saving vehicle');
    }
    setIsFormOpen(false);
    setSelectedVehicle(null);
  };

  const handleExportCSV = () => {
    alert(`CSV EXPORT INITIATED // ${vehicles.length} records written to local disk.`);
  };

  const handlePrint = () => {
    alert('PRINT MANIFEST GENERATED // Spooling payload to fleet terminal printer...');
  };

  const filteredVehicles = vehicles
    .filter(v => {
      const matchSearch =
        v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = !statusFilter || v.status === statusFilter;
      const matchType = !typeFilter || v.vehicleType === typeFilter;
      const matchRegion = !regionFilter || v.region === regionFilter;
      
      return matchSearch && matchStatus && matchType && matchRegion;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let valA: any;
      let valB: any;
      
      if (sortBy === 'registration') {
        valA = a.registrationNumber;
        valB = b.registrationNumber;
      } else if (sortBy === 'capacity') {
        valA = a.maxLoadCapacity;
        valB = b.maxLoadCapacity;
      } else if (sortBy === 'odometer') {
        valA = a.currentOdometer;
        valB = b.currentOdometer;
      } else if (sortBy === 'cost') {
        valA = a.acquisitionCost;
        valB = b.acquisitionCost;
      }
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const totalCount = filteredVehicles.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const totalVehiclesCount = vehicles.length;
  const availableCount = vehicles.filter(v => v.status === 'Available').length;
  const onTripCount = vehicles.filter(v => v.status === 'On Trip').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'Maintenance').length;

  return (
    <div className="flex flex-col gap-6 text-left select-none font-sans">
      <div className="border-b border-[#2C2C2C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono tracking-widest uppercase">
            <span>Dashboard</span>
            <ChevronRight size={10} />
            <span>Fleet</span>
            <ChevronRight size={10} />
            <span className="text-white">Vehicles</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white mt-1 leading-none">
            VEHICLE REGISTRY
          </h1>
          <p className="text-[11px] text-gray-500 mt-2 font-mono tracking-wide">
            FLEET METADATA DATABASE // RECORDS: {totalVehiclesCount}
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
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 h-9 px-3 bg-[#D97706] border border-[#D97706] text-xs font-mono font-semibold uppercase tracking-wider text-white hover:bg-[#B45309] active:bg-[#92400E] rounded-none cursor-pointer transition-colors"
            >
              <Plus size={14} />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader variant="cards" count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <SummaryCard title="Total Vehicles" count={totalVehiclesCount} icon={Truck} subtitle="Registered active fleet logs" />
          <SummaryCard title="Available" count={availableCount} icon={CheckCircle2} subtitle="Yard storage available status" />
          <SummaryCard title="On Trip" count={onTripCount} icon={Route} subtitle="Active consignments en route" />
          <SummaryCard title="Maintenance" count={maintenanceCount} icon={Wrench} subtitle="Schedules under repair workshop" />
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <div className="h-10 bg-[#1C1C20] border border-[#2C2C2C] rounded-none animate-pulse w-full" />
          <SkeletonLoader variant="table" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="py-12 border border-[#2C2C2C] bg-[#111111] text-center flex flex-col items-center justify-center font-mono">
          <AlertTriangle className="text-gray-600 mb-3" size={32} />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">No Vehicles Registered</h3>
          <p className="text-xs text-gray-500 font-sans mt-1 leading-relaxed max-w-sm">
            There are no commercial vehicles tracked inside the localized registry. Push a vehicle record sheet to begin tracking fleet telemetry.
          </p>
          <Button
            variant="primary"
            onClick={handleOpenAdd}
            className="mt-6 font-mono text-xs h-10 tracking-wider flex items-center gap-2"
          >
            <Plus size={14} />
            <span>Register First Vehicle</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <VehicleFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            regionFilter={regionFilter}
            onRegionChange={setRegionFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={handleResetFilters}
          />

          {paginatedVehicles.length === 0 ? (
            <EmptyState 
              title="No Results Match Filters" 
              description="No vehicle logs inside the database match your current search queries or filter attributes. Reset filters to restore lists." 
            />
          ) : (
            <div className="flex flex-col gap-4">
              <VehicleTable
                vehicles={paginatedVehicles}
                onView={handleView}
                onEdit={handleOpenEdit}
                onArchive={handleArchive}
                onDelete={handleOpenDelete}
                onDuplicate={handleDuplicate}
                sortField={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
              />

              {/* Pagination controls */}
              <div className="border border-[#2C2C2C] bg-[#111111] px-4 py-3 flex items-center justify-between font-mono text-[11px] select-none uppercase tracking-wider text-gray-400">
                <div>
                  Showing {totalCount > 0 ? startIndex + 1 : 0}–{endIndex} of {totalCount} Vehicles
                </div>
                <div className="flex items-center gap-6">
                  {/* Page Size Selector */}
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

                  {/* Nav controls */}
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

      {/* Details drawer panel */}
      <VehicleDetailsDrawer
        vehicle={selectedVehicle}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedVehicle(null);
        }}
      />

      {/* Form modal */}
      <VehicleForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedVehicle(null);
        }}
        onSubmit={handleFormSubmit}
        vehicle={selectedVehicle}
        existingRegNumbers={vehicles
          .filter(v => !selectedVehicle || v.registrationNumber !== selectedVehicle.registrationNumber)
          .map(v => v.registrationNumber)}
      />

      {/* Delete Dialog alert overlay */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setVehicleToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        registrationNumber={vehicleToDelete?.registrationNumber || ''}
      />
    </div>
  );
};
