import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { MaintenanceJob } from '../../mock/maintenance';
import type { Vehicle } from '../../mock/vehicles';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X, Save } from 'lucide-react';

interface MaintenanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MaintenanceJob) => void;
  job: MaintenanceJob | null;
  existingJobIds: string[];
  vehicles: Vehicle[];
}

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  job,
  existingJobIds,
  vehicles,
}) => {
  if (!isOpen) return null;

  const isEdit = !!job;

  const formSchema = z.object({
    jobId: z.string().min(1, 'Job ID is required.')
      .refine(
        (val) => isEdit || !existingJobIds.map(id => id.toLowerCase()).includes(val.toLowerCase()),
        { message: 'Job ID must be unique.' }
      ),
    vehicleReg: z.string().min(1, 'Vehicle registration is required.'),
    maintenanceType: z.enum([
      'Preventive', 'Corrective', 'Breakdown', 'Inspection', 
      'Oil Change', 'Tyre Replacement', 'Brake Service'
    ] as const, { message: 'Type is required.' }),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical'] as const, { message: 'Priority is required.' }),
    assignedMechanic: z.string().min(1, 'Mechanic name is required.'),
    scheduledDate: z.string().min(1, 'Scheduled Date is required.'),
    estimatedDuration: z.number().min(0.5, 'Duration must be at least 0.5 hours.'),
    estimatedCost: z.number().min(0, 'Estimated Cost cannot be negative.'),
    description: z.string().min(1, 'Description is required.'),
    requiredPartsInput: z.string(),
    status: z.enum([
      'Scheduled', 'In Progress', 'Waiting Parts', 'Completed', 'Cancelled', 'Overdue'
    ] as const, { message: 'Status is required.' }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const defaultPartsStr = job ? job.requiredParts.join(', ') : '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: job
      ? {
          jobId: job.jobId,
          vehicleReg: job.vehicleReg,
          maintenanceType: job.maintenanceType,
          priority: job.priority,
          assignedMechanic: job.assignedMechanic,
          scheduledDate: job.scheduledDate,
          estimatedDuration: job.estimatedDuration,
          estimatedCost: job.estimatedCost,
          description: job.description,
          requiredPartsInput: defaultPartsStr,
          status: job.status,
        }
      : {
          jobId: '',
          vehicleReg: '',
          maintenanceType: 'Preventive',
          priority: 'Medium',
          assignedMechanic: '',
          scheduledDate: new Date().toISOString().split('T')[0],
          estimatedDuration: 2,
          estimatedCost: 0,
          description: '',
          requiredPartsInput: '',
          status: 'Scheduled',
        },
  });

  const watchType = watch('maintenanceType');

  const filteredVehicles = vehicles.filter(v => {
    if (isEdit && job?.vehicleReg === v.registrationNumber) return true;
    
    if (v.status === 'On Trip' || v.status === 'Retired') return false;

    if (watchType === 'Preventive' || watchType === 'Inspection' || watchType === 'Oil Change' || watchType === 'Tyre Replacement' || watchType === 'Brake Service') {
      return v.status === 'Available';
    }

    return v.status === 'Available' || v.status === 'Maintenance';
  });

  const vehicleOptions = filteredVehicles.map(v => ({
    value: v.registrationNumber,
    label: `${v.registrationNumber} - ${v.vehicleName} (${v.status})`,
  }));

  const typeOptions = [
    { value: 'Preventive', label: 'Preventive Maintenance' },
    { value: 'Corrective', label: 'Corrective Action' },
    { value: 'Breakdown', label: 'Breakdown Repair' },
    { value: 'Inspection', label: 'Safety Inspection' },
    { value: 'Oil Change', label: 'Oil & Filter Change' },
    { value: 'Tyre Replacement', label: 'Tyre Replacement' },
    { value: 'Brake Service', label: 'Brake Overhaul' },
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' },
  ];

  const statusOptions = [
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Waiting Parts', label: 'Waiting Parts' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Overdue', label: 'Overdue' },
  ];

  const handleFormSubmit = (data: FormValues) => {
    const partsArray = data.requiredPartsInput
      .split(',')
      .map(p => p.trim())
      .filter(p => p !== '');

    const maintenanceJob: MaintenanceJob = {
      jobId: data.jobId,
      vehicleReg: data.vehicleReg,
      maintenanceType: data.maintenanceType,
      priority: data.priority,
      assignedMechanic: data.assignedMechanic,
      scheduledDate: data.scheduledDate,
      estimatedCost: data.estimatedCost,
      actualCost: job?.actualCost,
      estimatedDuration: data.estimatedDuration,
      description: data.description,
      requiredParts: partsArray,
      status: data.status,
      archived: job?.archived || false,
    };

    if (data.status === 'Completed' && !maintenanceJob.completionDate) {
      maintenanceJob.completionDate = new Date().toISOString().split('T')[0];
      maintenanceJob.actualCost = data.estimatedCost;
    }

    onSubmit(maintenanceJob);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-sans select-none overflow-y-auto">
      <div className="max-w-2xl w-full border border-[#2C2C2C] bg-[#111111] p-6 text-left relative flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#D97706]" />

        <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-4 mb-4 font-mono">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            {isEdit ? `Edit Job Sheet [${job.jobId}]` : 'Schedule Maintenance Job'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="jobId"
              label="Maintenance Job ID"
              placeholder="e.g. MNT-2026-0001"
              error={errors.jobId?.message}
              disabled={isSubmitting || isEdit}
              {...register('jobId')}
            />
            <Select
              id="mType"
              label="Service Type"
              options={typeOptions}
              error={errors.maintenanceType?.message}
              disabled={isSubmitting}
              {...register('maintenanceType')}
            />
            <Select
              id="veh-sel"
              label="Assign Vehicle"
              options={vehicleOptions}
              error={errors.vehicleReg?.message}
              disabled={isSubmitting}
              {...register('vehicleReg')}
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
              id="mech"
              label="Assigned Mechanic"
              placeholder="e.g. Amit Sharma"
              error={errors.assignedMechanic?.message}
              disabled={isSubmitting}
              {...register('assignedMechanic')}
            />
            <Select
              id="status-sel"
              label="Job Status"
              options={statusOptions}
              error={errors.status?.message}
              disabled={isSubmitting}
              {...register('status')}
            />
            <Input
              id="schDate"
              label="Scheduled Date"
              type="date"
              error={errors.scheduledDate?.message}
              disabled={isSubmitting}
              {...register('scheduledDate')}
            />
            <Input
              id="estDur"
              label="Est Duration (hours)"
              placeholder="e.g. 4"
              type="number"
              step="0.5"
              error={errors.estimatedDuration?.message}
              disabled={isSubmitting}
              {...register('estimatedDuration', { valueAsNumber: true })}
            />
            <Input
              id="estCost"
              label="Estimated Cost (INR)"
              placeholder="e.g. 5000"
              type="number"
              error={errors.estimatedCost?.message}
              disabled={isSubmitting}
              {...register('estimatedCost', { valueAsNumber: true })}
            />
            <Input
              id="reqParts"
              label="Required Parts (Comma Separated)"
              placeholder="e.g. Alternator Belt, Coolant fluid"
              error={errors.requiredPartsInput?.message}
              disabled={isSubmitting}
              {...register('requiredPartsInput')}
            />
            <div className="sm:col-span-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block font-mono">
                Job Details & Diagnostic Description
              </label>
              <textarea
                id="desc"
                placeholder="Diagnostic readings, mechanical symptoms reported..."
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
              <span>Save Job</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
