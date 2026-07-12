import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Vehicle } from '../../mock/vehicles';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X, Save } from 'lucide-react';

interface VehicleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Vehicle) => void;
  vehicle: Vehicle | null;
  existingRegNumbers: string[];
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vehicle,
  existingRegNumbers,
}) => {
  if (!isOpen) return null;

  const isEdit = !!vehicle;

  const formSchema = z.object({
    registrationNumber: z.string().min(1, 'Registration Number is required.')
      .refine(
        (val) => isEdit || !existingRegNumbers.map(n => n.toLowerCase()).includes(val.toLowerCase()),
        { message: 'Registration Number must be unique.' }
      ),
    vehicleName: z.string().min(1, 'Vehicle Name is required.'),
    manufacturer: z.string().min(1, 'Manufacturer is required.'),
    model: z.string().min(1, 'Model is required.'),
    modelYear: z.number().min(1900, 'Model Year is required.').max(new Date().getFullYear() + 1, 'Model Year cannot be in the future.'),
    vehicleType: z.enum(['HGV', 'LCV', 'Trailer', 'Container'] as const, {
      message: 'Vehicle Type is required.',
    }),
    fuelType: z.enum(['Diesel', 'CNG', 'Electric', 'Petrol'] as const, {
      message: 'Fuel Type is required.',
    }),
    maxLoadCapacity: z.number().min(1, 'Maximum Load Capacity must be greater than zero.'),
    currentOdometer: z.number().min(0, 'Odometer cannot be negative.'),
    acquisitionCost: z.number().min(0, 'Acquisition Cost cannot be negative.'),
    purchaseDate: z.string().min(1, 'Purchase Date is required.')
      .refine((val) => new Date(val) <= new Date(), { message: 'Purchase Date cannot be in the future.' }),
    insuranceExpiry: z.string().min(1, 'Insurance Expiry is required.')
      .refine((val) => new Date(val) > new Date(), { message: 'Insurance Expiry must be after today.' }),
    registrationExpiry: z.string().min(1, 'Registration Expiry is required.')
      .refine((val) => new Date(val) > new Date(), { message: 'Registration Expiry must be after today.' }),
    assignedDriver: z.string(),
    status: z.enum(['Available', 'On Trip', 'Maintenance', 'Retired'] as const, {
      message: 'Status is required.',
    }),
    region: z.enum(['West', 'North', 'South', 'East'] as const, {
      message: 'Region is required.',
    }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: vehicle || {
      registrationNumber: '',
      vehicleName: '',
      manufacturer: '',
      model: '',
      modelYear: new Date().getFullYear(),
      vehicleType: 'HGV',
      fuelType: 'Diesel',
      maxLoadCapacity: 0,
      currentOdometer: 0,
      acquisitionCost: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      insuranceExpiry: '',
      registrationExpiry: '',
      assignedDriver: '',
      status: 'Available',
      region: 'West',
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    const vehicleData: Vehicle = {
      ...data,
      vinNumber: vehicle?.vinNumber || `VIN${Math.random().toString(36).substring(2, 17).toUpperCase()}`,
      engineNumber: vehicle?.engineNumber || `ENG${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
    };
    onSubmit(vehicleData);
  };

  const typeOptions = [
    { value: 'HGV', label: 'HGV (Heavy Goods Vehicle)' },
    { value: 'LCV', label: 'LCV (Light Commercial Vehicle)' },
    { value: 'Trailer', label: 'Trailer' },
    { value: 'Container', label: 'Container' },
  ];

  const fuelOptions = [
    { value: 'Diesel', label: 'Diesel' },
    { value: 'CNG', label: 'CNG' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Petrol', label: 'Petrol' },
  ];

  const statusOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'On Trip', label: 'On Trip' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Retired', label: 'Retired' },
  ];

  const regionOptions = [
    { value: 'West', label: 'West' },
    { value: 'North', label: 'North' },
    { value: 'South', label: 'South' },
    { value: 'East', label: 'East' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-sans select-none overflow-y-auto">
      <div className="max-w-2xl w-full border border-[#2C2C2C] bg-[#111111] p-6 text-left relative flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#D97706]" />

        <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-4 mb-4 font-mono">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            {isEdit ? `Edit Vehicle [${vehicle.registrationNumber}]` : 'Register New Vehicle'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="regNum"
              label="Registration Number"
              placeholder="e.g. MH-12-PQ-4567"
              error={errors.registrationNumber?.message}
              disabled={isSubmitting || isEdit}
              {...register('registrationNumber')}
            />
            <Input
              id="vName"
              label="Vehicle Name"
              placeholder="e.g. Ashok Leyland Partner"
              error={errors.vehicleName?.message}
              disabled={isSubmitting}
              {...register('vehicleName')}
            />
            <Input
              id="mfr"
              label="Manufacturer"
              placeholder="e.g. Ashok Leyland"
              error={errors.manufacturer?.message}
              disabled={isSubmitting}
              {...register('manufacturer')}
            />
            <Input
              id="mdl"
              label="Model"
              placeholder="e.g. Partner 4-Tyre"
              error={errors.model?.message}
              disabled={isSubmitting}
              {...register('model')}
            />
            <Input
              id="mYear"
              label="Model Year"
              placeholder="e.g. 2022"
              type="number"
              error={errors.modelYear?.message}
              disabled={isSubmitting}
              {...register('modelYear', { valueAsNumber: true })}
            />
            <Select
              id="vType"
              label="Vehicle Type"
              options={typeOptions}
              error={errors.vehicleType?.message}
              disabled={isSubmitting}
              {...register('vehicleType')}
            />
            <Select
              id="fType"
              label="Fuel Type"
              options={fuelOptions}
              error={errors.fuelType?.message}
              disabled={isSubmitting}
              {...register('fuelType')}
            />
            <Input
              id="lCap"
              label="Max Load Capacity (kg)"
              placeholder="e.g. 3500"
              type="number"
              error={errors.maxLoadCapacity?.message}
              disabled={isSubmitting}
              {...register('maxLoadCapacity', { valueAsNumber: true })}
            />
            <Input
              id="odom"
              label="Current Odometer (km)"
              placeholder="e.g. 45200"
              type="number"
              error={errors.currentOdometer?.message}
              disabled={isSubmitting}
              {...register('currentOdometer', { valueAsNumber: true })}
            />
            <Input
              id="acCost"
              label="Acquisition Cost (INR)"
              placeholder="e.g. 1200000"
              type="number"
              error={errors.acquisitionCost?.message}
              disabled={isSubmitting}
              {...register('acquisitionCost', { valueAsNumber: true })}
            />
            <Input
              id="pDate"
              label="Purchase Date"
              type="date"
              error={errors.purchaseDate?.message}
              disabled={isSubmitting}
              {...register('purchaseDate')}
            />
            <Input
              id="iExp"
              label="Insurance Expiry"
              type="date"
              error={errors.insuranceExpiry?.message}
              disabled={isSubmitting}
              {...register('insuranceExpiry')}
            />
            <Input
              id="rExp"
              label="Registration Expiry"
              type="date"
              error={errors.registrationExpiry?.message}
              disabled={isSubmitting}
              {...register('registrationExpiry')}
            />
            <Input
              id="driver"
              label="Assigned Driver"
              placeholder="e.g. John Miller"
              error={errors.assignedDriver?.message}
              disabled={isSubmitting}
              {...register('assignedDriver')}
            />
            <Select
              id="status-sel"
              label="Current Status"
              options={statusOptions}
              error={errors.status?.message}
              disabled={isSubmitting}
              {...register('status')}
            />
            <Select
              id="region-sel"
              label="Operational Region"
              options={regionOptions}
              error={errors.region?.message}
              disabled={isSubmitting}
              {...register('region')}
            />
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
              <span>Save Vehicle</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
