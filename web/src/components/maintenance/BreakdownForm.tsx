import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Vehicle } from '../../mock/vehicles';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X, AlertOctagon } from 'lucide-react';

interface BreakdownFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    vehicleReg: string;
    location: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
  }) => void;
  vehicles: Vehicle[];
}

export const BreakdownForm: React.FC<BreakdownFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vehicles,
}) => {
  if (!isOpen) return null;

  const formSchema = z.object({
    vehicleReg: z.string().min(1, 'Vehicle is required.'),
    location: z.string().min(1, 'Location of breakdown is required.'),
    description: z.string().min(1, 'Description is required.'),
    severity: z.enum(['Low', 'Medium', 'High', 'Critical'] as const, {
      message: 'Severity level is required.',
    }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleReg: '',
      location: '',
      description: '',
      severity: 'Critical',
    },
  });

  const activeVehicles = vehicles.filter(v => v.status !== 'Retired');

  const vehicleOptions = activeVehicles.map(v => ({
    value: v.registrationNumber,
    label: `${v.registrationNumber} - ${v.vehicleName} (${v.status})`,
  }));

  const severityOptions = [
    { value: 'Low', label: 'Low Severity' },
    { value: 'Medium', label: 'Medium Severity' },
    { value: 'High', label: 'High Severity' },
    { value: 'Critical', label: 'Critical / Breakdown' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-sans select-none overflow-y-auto">
      <div className="max-w-md w-full border border-[#2C2C2C] bg-[#111111] p-6 text-left relative flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#991B1B]" />

        <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-4 mb-4 font-mono">
          <div className="flex items-center gap-2 text-[#EF4444]">
            <AlertOctagon size={16} />
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Report Fleet Breakdown
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 font-sans text-xs">
          <Select
            id="veh-sel"
            label="Select Damaged Vehicle"
            options={vehicleOptions}
            error={errors.vehicleReg?.message}
            disabled={isSubmitting}
            {...register('vehicleReg')}
          />
          <Input
            id="loc"
            label="Location / Highway Marker"
            placeholder="e.g. NH-48, Sector 15 Near Toll Plaza"
            error={errors.location?.message}
            disabled={isSubmitting}
            {...register('location')}
          />
          <Select
            id="sev-sel"
            label="Problem Severity"
            options={severityOptions}
            error={errors.severity?.message}
            disabled={isSubmitting}
            {...register('severity')}
          />
          <div>
            <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block font-mono">
              Problem Description / Incident Detail
            </label>
            <textarea
              id="desc"
              placeholder="e.g. Engine lost compression, smoke from radiator coolant tank, starter motor clicking..."
              rows={3}
              disabled={isSubmitting}
              className="w-full bg-[#0F0F10] border border-[#2C2C2C] p-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D97706] rounded-none resize-none font-sans"
              {...register('description')}
            />
            {errors.description?.message && (
              <span className="text-[10px] text-red-500 font-mono mt-1 block">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 border border-[#2C2C2C] bg-[#0F0F10] p-4 text-center text-gray-500 select-none">
            <span className="text-[10px] uppercase font-mono">Photo Attachment Placeholder</span>
            <span className="text-[8px] font-sans font-normal">Real-time driver camera submissions load here</span>
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-[#2C2C2C] pt-4 font-mono">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              isLoading={isSubmitting}
              className="h-9 text-xs flex items-center gap-2"
            >
              <AlertOctagon size={13} />
              <span>Report Breakdown</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
