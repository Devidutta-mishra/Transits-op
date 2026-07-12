import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FuelLog } from '../../mock/fuel';
import type { Vehicle } from '../../mock/vehicles';
import type { Driver } from '../../mock/drivers';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X, Save } from 'lucide-react';

interface FuelFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FuelLog) => void;
  existingLogs: FuelLog[];
  vehicles: Vehicle[];
  drivers: Driver[];
}

export const FuelForm: React.FC<FuelFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingLogs,
  vehicles,
  drivers,
}) => {
  if (!isOpen) return null;

  const getPreviousOdo = (vehicleReg: string) => {
    const vehicleLogs = existingLogs.filter(l => l.vehicleReg === vehicleReg);
    if (vehicleLogs.length === 0) {
      const veh = vehicles.find(v => v.registrationNumber === vehicleReg);
      return veh ? veh.currentOdometer : 0;
    }
    return Math.max(...vehicleLogs.map(l => l.currentOdometer));
  };

  const formSchema = z.object({
    logId: z.string().min(1, 'Log ID is required.')
      .refine(
        (val) => !existingLogs.map(l => l.logId.toLowerCase()).includes(val.toLowerCase()),
        { message: 'Log ID must be unique.' }
      ),
    vehicleReg: z.string().min(1, 'Vehicle is required.'),
    driverId: z.string().min(1, 'Driver is required.'),
    fuelType: z.enum(['Diesel', 'Petrol', 'CNG', 'Biofuel'] as const, {
      message: 'Fuel Type is required.',
    }),
    quantity: z.number().min(0.1, 'Quantity must be greater than zero.'),
    pricePerLitre: z.number().min(0.1, 'Price per Litre must be positive.'),
    currentOdometer: z.number().min(1, 'Odometer must be positive.'),
    fuelStation: z.string().min(1, 'Fuel Station is required.'),
    paymentMethod: z.enum(['Fuel Card', 'Cash', 'Corporate Card', 'UPI'] as const, {
      message: 'Payment Method is required.',
    }),
    receiptNumber: z.string().min(1, 'Receipt Number is required.'),
    fuelDate: z.string().min(1, 'Fuel Date is required.')
      .refine(
        (val) => new Date(val) <= new Date('2026-07-12'),
        { message: 'Fuel Date cannot be in the future.' }
      ),
    remarks: z.string(),
  }).refine((data) => {
    const lastOdo = getPreviousOdo(data.vehicleReg);
    return data.currentOdometer > lastOdo;
  }, {
    message: 'Odometer must exceed the previous odometer log reading.',
    path: ['currentOdometer'],
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logId: '',
      vehicleReg: '',
      driverId: '',
      fuelType: 'Diesel',
      quantity: 0,
      pricePerLitre: 94.5,
      currentOdometer: 0,
      fuelStation: '',
      paymentMethod: 'Fuel Card',
      receiptNumber: '',
      fuelDate: new Date().toISOString().split('T')[0],
      remarks: '',
    },
  });

  const watchVehicle = watch('vehicleReg');
  const watchQty = watch('quantity') || 0;
  const watchPrice = watch('pricePerLitre') || 0;

  const previousOdometer = React.useMemo(() => {
    if (!watchVehicle) return 0;
    return getPreviousOdo(watchVehicle);
  }, [watchVehicle]);

  const activeVehicles = vehicles.filter(v => v.status === 'Available' || v.status === 'On Trip');

  const vehicleOptions = activeVehicles.map(v => ({
    value: v.registrationNumber,
    label: `${v.registrationNumber} - ${v.vehicleName} (${v.status}, Last Odo: ${getPreviousOdo(v.registrationNumber).toLocaleString()} km)`,
  }));

  const driverOptions = drivers.map(d => ({
    value: d.driverId,
    label: `${d.fullName} (ID: ${d.driverId})`,
  }));

  const fuelTypeOptions = [
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Petrol', label: 'Petrol' },
    { value: 'CNG', label: 'CNG' },
    { value: 'Biofuel', label: 'Biofuel' },
  ];

  const paymentMethodOptions = [
    { value: 'Fuel Card', label: 'Fuel Card' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Corporate Card', label: 'Corporate Card' },
    { value: 'UPI', label: 'UPI' },
  ];

  const handleFormSubmit = (data: FormValues) => {
    const totalCost = Number((data.quantity * data.pricePerLitre).toFixed(2));
    const lastOdo = getPreviousOdo(data.vehicleReg);
    const mileage = data.currentOdometer - lastOdo;
    const efficiency = Number((mileage / data.quantity).toFixed(2));

    const logData: FuelLog = {
      ...data,
      totalCost,
      mileageSinceLastFill: mileage,
      fuelEfficiency: efficiency,
    };

    onSubmit(logData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-sans select-none overflow-y-auto">
      <div className="max-w-2xl w-full border border-[#2C2C2C] bg-[#111111] p-6 text-left relative flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#D97706]" />

        <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-4 mb-4 font-mono">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Log Fuel Fill-Up Entry
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="logId"
              label="Fuel Log ID"
              placeholder="e.g. FLG-2026-0001"
              error={errors.logId?.message}
              disabled={isSubmitting}
              {...register('logId')}
            />
            <Select
              id="veh-sel"
              label="Select Vehicle"
              options={vehicleOptions}
              error={errors.vehicleReg?.message}
              disabled={isSubmitting}
              {...register('vehicleReg')}
            />
            <Select
              id="drv-sel"
              label="Select Driver"
              options={driverOptions}
              error={errors.driverId?.message}
              disabled={isSubmitting}
              {...register('driverId')}
            />
            <Select
              id="fType"
              label="Fuel Type"
              options={fuelTypeOptions}
              error={errors.fuelType?.message}
              disabled={isSubmitting}
              {...register('fuelType')}
            />
            <Input
              id="qty"
              label="Quantity (Litres)"
              placeholder="e.g. 75"
              type="number"
              step="0.1"
              error={errors.quantity?.message}
              disabled={isSubmitting}
              {...register('quantity', { valueAsNumber: true })}
            />
            <Input
              id="price"
              label="Price per Litre (INR)"
              placeholder="e.g. 94.50"
              type="number"
              step="0.01"
              error={errors.pricePerLitre?.message}
              disabled={isSubmitting}
              {...register('pricePerLitre', { valueAsNumber: true })}
            />
            <div className="flex flex-col gap-1">
              <Input
                id="odo"
                label="Current Odometer Reading (km)"
                placeholder="e.g. 48620"
                type="number"
                error={errors.currentOdometer?.message}
                disabled={isSubmitting}
                {...register('currentOdometer', { valueAsNumber: true })}
              />
              {watchVehicle && (
                <span className="text-[9px] text-gray-500 font-mono">
                  Previous Odo Reading: {previousOdometer.toLocaleString()} km
                </span>
              )}
            </div>
            <Input
              id="station"
              label="Fuel Station Station / Location"
              placeholder="e.g. HP Auto Care, Pune"
              error={errors.fuelStation?.message}
              disabled={isSubmitting}
              {...register('fuelStation')}
            />
            <Select
              id="pay-sel"
              label="Payment Method"
              options={paymentMethodOptions}
              error={errors.paymentMethod?.message}
              disabled={isSubmitting}
              {...register('paymentMethod')}
            />
            <Input
              id="receipt"
              label="Receipt / Voucher Number"
              placeholder="e.g. HP-90823"
              error={errors.receiptNumber?.message}
              disabled={isSubmitting}
              {...register('receiptNumber')}
            />
            <Input
              id="date"
              label="Fuel Date"
              type="date"
              error={errors.fuelDate?.message}
              disabled={isSubmitting}
              {...register('fuelDate')}
            />
            <div className="sm:col-span-2 text-xs font-mono border border-[#2C2C2C] bg-[#0F0F10] p-3 text-left flex justify-between uppercase">
              <span className="text-gray-400">Calculated Total Cost:</span>
              <span className="text-white font-bold">₹{(watchQty * watchPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block font-mono">
                Log Remarks / Special Notes
              </label>
              <textarea
                id="remarks"
                placeholder="Tire check notes, pump discrepancies..."
                rows={3}
                disabled={isSubmitting}
                className="w-full bg-[#0F0F10] border border-[#2C2C2C] p-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D97706] rounded-none resize-none font-sans"
                {...register('remarks')}
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
              <span>Save Entry</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
