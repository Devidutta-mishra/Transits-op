import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Trip } from '../../mock/trips';
import type { Vehicle } from '../../mock/vehicles';
import type { Driver } from '../../mock/drivers';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X, Save } from 'lucide-react';

interface TripFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Trip) => void;
  trip: Trip | null;
  existingTripIds: string[];
  vehicles: Vehicle[];
  drivers: Driver[];
}

export const TripForm: React.FC<TripFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  trip,
  existingTripIds,
  vehicles,
  drivers,
}) => {
  if (!isOpen) return null;

  const isEdit = !!trip;

  const formSchema = z.object({
    tripId: z.string().min(1, 'Trip ID is required.')
      .refine(
        (val) => isEdit || !existingTripIds.map(id => id.toLowerCase()).includes(val.toLowerCase()),
        { message: 'Trip ID must be unique.' }
      ),
    origin: z.string().min(1, 'Origin is required.'),
    destination: z.string().min(1, 'Destination is required.'),
    assignedVehicle: z.string().min(1, 'Vehicle assignment is required.'),
    assignedDriver: z.string().min(1, 'Driver assignment is required.'),
    cargoWeight: z.number().min(1, 'Cargo Weight must be greater than zero.'),
    plannedDistance: z.number().min(1, 'Planned Distance must be greater than zero.'),
    estimatedDuration: z.number().min(0.5, 'Estimated Duration must be at least 0.5 hours.'),
    revenue: z.number().min(0, 'Revenue cannot be negative.'),
    departureDate: z.string().min(1, 'Departure Date is required.'),
    estimatedArrival: z.string().min(1, 'ETA Date is required.'),
    priority: z.enum(['Low', 'Medium', 'High'] as const, {
      message: 'Priority is required.',
    }),
    notes: z.string(),
    status: z.enum(['Draft', 'Scheduled', 'Dispatched', 'In Transit', 'Completed', 'Cancelled'] as const, {
      message: 'Status is required.',
    }),
  }).refine((data) => {
    const selectedVeh = vehicles.find(v => v.registrationNumber === data.assignedVehicle);
    if (!selectedVeh) return true;
    return data.cargoWeight <= selectedVeh.maxLoadCapacity;
  }, {
    message: 'Cargo Weight exceeds the selected vehicle maximum capacity.',
    path: ['cargoWeight'],
  }).refine((data) => {
    const selectedDrv = drivers.find(d => d.driverId === data.assignedDriver);
    if (!selectedDrv) return true;
    return new Date(selectedDrv.licenseExpiryDate) > new Date('2026-07-12');
  }, {
    message: 'Selected driver license has expired and cannot be dispatched.',
    path: ['assignedDriver'],
  }).refine((data) => {
    const selectedDrv = drivers.find(d => d.driverId === data.assignedDriver);
    if (!selectedDrv) return true;
    return selectedDrv.status !== 'Suspended';
  }, {
    message: 'Selected driver is suspended and cannot be dispatched.',
    path: ['assignedDriver'],
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: trip || {
      tripId: '',
      origin: '',
      destination: '',
      assignedVehicle: '',
      assignedDriver: '',
      cargoWeight: 0,
      plannedDistance: 0,
      estimatedDuration: 0,
      revenue: 0,
      departureDate: new Date().toISOString().split('T')[0],
      estimatedArrival: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      notes: '',
      status: 'Draft',
    },
  });

  const watchVehicle = watch('assignedVehicle');

  const handleFormSubmit = (data: FormValues) => {
    const tripData: Trip = {
      ...data,
      progress: trip?.progress || 0,
    };
    onSubmit(tripData);
  };

  const filteredVehicles = vehicles.filter(v => {
    const isCurrent = isEdit && trip?.assignedVehicle === v.registrationNumber;
    return v.status === 'Available' || isCurrent;
  });

  const filteredDrivers = drivers.filter(d => {
    const isCurrent = isEdit && trip?.assignedDriver === d.driverId;
    const isLicValid = new Date(d.licenseExpiryDate) > new Date('2026-07-12');
    const isNotSusp = d.status !== 'Suspended';
    return (d.status === 'Available' && isLicValid && isNotSusp) || isCurrent;
  });

  const vehicleOptions = filteredVehicles.map(v => ({
    value: v.registrationNumber,
    label: `${v.registrationNumber} - ${v.vehicleName} (Max: ${v.maxLoadCapacity.toLocaleString()} kg)`,
  }));

  const driverOptions = filteredDrivers.map(d => ({
    value: d.driverId,
    label: `${d.fullName} (Exp: ${d.yearsOfExperience} yrs, Safety: ${d.safetyScore}/100)`,
  }));

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ];

  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'Dispatched', label: 'Dispatched' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  const selectedVehModel = vehicles.find(v => v.registrationNumber === watchVehicle);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-sans select-none overflow-y-auto">
      <div className="max-w-2xl w-full border border-[#2C2C2C] bg-[#111111] p-6 text-left relative flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#D97706]" />

        <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-4 mb-4 font-mono">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            {isEdit ? `Edit Dispatch Sheet [${trip.tripId}]` : 'Create Dispatch Manifest'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="trpId"
              label="Trip ID"
              placeholder="e.g. TRP-2026-0001"
              error={errors.tripId?.message}
              disabled={isSubmitting || isEdit}
              {...register('tripId')}
            />
            <Select
              id="priority-sel"
              label="Priority Level"
              options={priorityOptions}
              error={errors.priority?.message}
              disabled={isSubmitting}
              {...register('priority')}
            />
            <Input
              id="orig"
              label="Origin City / Yard"
              placeholder="e.g. Mumbai (West)"
              error={errors.origin?.message}
              disabled={isSubmitting}
              {...register('origin')}
            />
            <Input
              id="dest"
              label="Destination City / Yard"
              placeholder="e.g. Pune (West)"
              error={errors.destination?.message}
              disabled={isSubmitting}
              {...register('destination')}
            />
            <Select
              id="veh-sel"
              label="Assign Vehicle"
              options={vehicleOptions}
              error={errors.assignedVehicle?.message}
              disabled={isSubmitting}
              {...register('assignedVehicle')}
            />
            <Select
              id="drv-sel"
              label="Assign Driver"
              options={driverOptions}
              error={errors.assignedDriver?.message}
              disabled={isSubmitting}
              {...register('assignedDriver')}
            />
            <div className="flex flex-col gap-1">
              <Input
                id="cWeight"
                label="Cargo Weight (kg)"
                placeholder="e.g. 15000"
                type="number"
                error={errors.cargoWeight?.message}
                disabled={isSubmitting}
                {...register('cargoWeight', { valueAsNumber: true })}
              />
              {selectedVehModel && (
                <span className="text-[9px] text-gray-500 font-mono">
                  Vehicle Load Limit: {selectedVehModel.maxLoadCapacity.toLocaleString()} kg
                </span>
              )}
            </div>
            <Input
              id="pDist"
              label="Planned Distance (km)"
              placeholder="e.g. 150"
              type="number"
              error={errors.plannedDistance?.message}
              disabled={isSubmitting}
              {...register('plannedDistance', { valueAsNumber: true })}
            />
            <Input
              id="eDur"
              label="Estimated Duration (hrs)"
              placeholder="e.g. 4.5"
              type="number"
              step="0.1"
              error={errors.estimatedDuration?.message}
              disabled={isSubmitting}
              {...register('estimatedDuration', { valueAsNumber: true })}
            />
            <Input
              id="revCost"
              label="Estimated Revenue (INR)"
              placeholder="e.g. 45000"
              type="number"
              error={errors.revenue?.message}
              disabled={isSubmitting}
              {...register('revenue', { valueAsNumber: true })}
            />
            <Input
              id="depDate"
              label="Departure Date"
              type="date"
              error={errors.departureDate?.message}
              disabled={isSubmitting}
              {...register('departureDate')}
            />
            <Input
              id="arrDate"
              label="ETA (Arrival Date)"
              type="date"
              error={errors.estimatedArrival?.message}
              disabled={isSubmitting}
              {...register('estimatedArrival')}
            />
            <Select
              id="status-sel"
              label="Dispatch Status"
              options={statusOptions}
              error={errors.status?.message}
              disabled={isSubmitting}
              {...register('status')}
            />
            <div className="sm:col-span-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block font-mono">
                Manifest Notes / Special Instructions
              </label>
              <textarea
                id="notes"
                placeholder="Consignment specs, delivery protocols, toll preferences..."
                rows={3}
                disabled={isSubmitting}
                className="w-full bg-[#0F0F10] border border-[#2C2C2C] p-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D97706] rounded-none resize-none font-sans"
                {...register('notes')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-[#2C2C2C] pt-4 font-mono">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="h-10 text-xs flex items-center gap-2"
            >
              <Save size={14} />
              <span>Save Manifest</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
