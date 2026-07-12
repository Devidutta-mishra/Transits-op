import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Driver } from '../../mock/drivers';
import type { Role } from '../../types/auth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X, Save } from 'lucide-react';

interface DriverFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Driver) => void;
  driver: Driver | null;
  existingIds: string[];
  existingLicenses: string[];
  role: Role;
}

export const DriverForm: React.FC<DriverFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  driver,
  existingIds,
  existingLicenses,
  role,
}) => {
  if (!isOpen) return null;

  const isEdit = !!driver;
  const isDispatcher = role === 'DISPATCHER';
  const isSafety = role === 'SAFETY_OFFICER';

  const formSchema = z.object({
    driverId: z.string().min(1, 'Driver ID is required.')
      .refine(
        (val) => isEdit || !existingIds.map(id => id.toLowerCase()).includes(val.toLowerCase()),
        { message: 'Driver ID must be unique.' }
      ),
    fullName: z.string().min(1, 'Driver Name is required.'),
    email: z.string().min(1, 'Email is required.').email('Email must be valid.'),
    phoneNumber: z.string().min(1, 'Phone number is required.'),
    dateOfBirth: z.string().min(1, 'Date of Birth is required.')
      .refine((val) => {
        const age = new Date().getFullYear() - new Date(val).getFullYear();
        return age >= 18;
      }, { message: 'Driver must be at least 18 years old.' }),
    gender: z.enum(['Male', 'Female', 'Other'] as const, {
      message: 'Gender is required.',
    }),
    address: z.string().min(1, 'Address is required.'),
    emergencyContact: z.string().min(1, 'Emergency contact is required.'),
    licenseNumber: z.string().min(1, 'License Number is required.')
      .refine(
        (val) => isEdit || !existingLicenses.map(l => l.toLowerCase()).includes(val.toLowerCase()),
        { message: 'License Number must be unique.' }
      ),
    licenseCategory: z.enum(['Heavy', 'Light', 'Hazardous'] as const, {
      message: 'License Category is required.',
    }),
    licenseIssueDate: z.string().min(1, 'License Issue Date is required.')
      .refine((val) => new Date(val) <= new Date(), { message: 'Issue Date cannot be in the future.' }),
    licenseExpiryDate: z.string().min(1, 'License Expiry Date is required.')
      .refine((val) => new Date(val) > new Date('2026-07-12'), { message: 'License Expiry Date must be after today.' }),
    joiningDate: z.string().min(1, 'Joining Date is required.')
      .refine((val) => new Date(val) <= new Date(), { message: 'Joining Date cannot be in the future.' }),
    yearsOfExperience: z.number().min(0, 'Experience cannot be negative.'),
    safetyScore: z.number().min(0, 'Safety Score must be at least 0.').max(100, 'Safety Score cannot exceed 100.'),
    assignedVehicle: z.string(),
    status: z.enum(['Available', 'On Trip', 'Off Duty', 'Suspended'] as const, {
      message: 'Status is required.',
    }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: driver || {
      driverId: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: 'Male',
      address: '',
      emergencyContact: '',
      licenseNumber: '',
      licenseCategory: 'Heavy',
      licenseIssueDate: '',
      licenseExpiryDate: '',
      joiningDate: new Date().toISOString().split('T')[0],
      yearsOfExperience: 0,
      safetyScore: 100,
      assignedVehicle: '',
      status: 'Available',
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    const driverData: Driver = {
      ...data,
      archived: driver?.archived || false,
    };
    onSubmit(driverData);
  };

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  const licenseCategoryOptions = [
    { value: 'Heavy', label: 'Heavy Commercial' },
    { value: 'Light', label: 'Light Commercial' },
    { value: 'Hazardous', label: 'Hazardous Materials' },
  ];

  const statusOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'On Trip', label: 'On Trip' },
    { value: 'Off Duty', label: 'Off Duty' },
    { value: 'Suspended', label: 'Suspended' },
  ];

  const isIdDisabled = isEdit || isDispatcher || isSafety;
  const isGeneralDisabled = isDispatcher || isSafety;
  const isComplianceDisabled = isDispatcher;
  const isVehicleDisabled = false;
  const isStatusDisabled = isDispatcher;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-sans select-none overflow-y-auto">
      <div className="max-w-2xl w-full border border-[#2C2C2C] bg-[#111111] p-6 text-left relative flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#D97706]" />

        <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-4 mb-4 font-mono">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            {isEdit ? `Edit Driver Profile [${driver.driverId}]` : 'Register New Driver'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="drvId"
              label="Driver ID"
              placeholder="e.g. DRV-2022-1204"
              error={errors.driverId?.message}
              disabled={isSubmitting || isIdDisabled}
              {...register('driverId')}
            />
            <Input
              id="fName"
              label="Full Name"
              placeholder="e.g. David Jones"
              error={errors.fullName?.message}
              disabled={isSubmitting || isGeneralDisabled}
              {...register('fullName')}
            />
            <Input
              id="emailAddr"
              label="Email Address"
              placeholder="e.g. david.jones@transitops.com"
              error={errors.email?.message}
              disabled={isSubmitting || isGeneralDisabled}
              {...register('email')}
            />
            <Input
              id="pNum"
              label="Phone Number"
              placeholder="e.g. +91 98765 43210"
              error={errors.phoneNumber?.message}
              disabled={isSubmitting || isGeneralDisabled}
              {...register('phoneNumber')}
            />
            <Input
              id="dob"
              label="Date of Birth"
              type="date"
              error={errors.dateOfBirth?.message}
              disabled={isSubmitting || isGeneralDisabled}
              {...register('dateOfBirth')}
            />
            <Select
              id="gender-sel"
              label="Gender"
              options={genderOptions}
              error={errors.gender?.message}
              disabled={isSubmitting || isGeneralDisabled}
              {...register('gender')}
            />
            <Input
              id="addr"
              label="Home Address"
              placeholder="e.g. Flat 302, Sunrise Heights, HSR Layout"
              error={errors.address?.message}
              disabled={isSubmitting || isGeneralDisabled}
              {...register('address')}
            />
            <Input
              id="eContact"
              label="Emergency Contact"
              placeholder="e.g. Sarah Jones (+91 98765 43210)"
              error={errors.emergencyContact?.message}
              disabled={isSubmitting || isGeneralDisabled}
              {...register('emergencyContact')}
            />
            <Input
              id="licNum"
              label="License Number"
              placeholder="e.g. DL-0920191102931"
              error={errors.licenseNumber?.message}
              disabled={isSubmitting || isComplianceDisabled}
              {...register('licenseNumber')}
            />
            <Select
              id="lCat-sel"
              label="License Category"
              options={licenseCategoryOptions}
              error={errors.licenseCategory?.message}
              disabled={isSubmitting || isComplianceDisabled}
              {...register('licenseCategory')}
            />
            <Input
              id="licIssue"
              label="License Issue Date"
              type="date"
              error={errors.licenseIssueDate?.message}
              disabled={isSubmitting || isComplianceDisabled}
              {...register('licenseIssueDate')}
            />
            <Input
              id="licExp"
              label="License Expiry Date"
              type="date"
              error={errors.licenseExpiryDate?.message}
              disabled={isSubmitting || isComplianceDisabled}
              {...register('licenseExpiryDate')}
            />
            <Input
              id="jDate"
              label="Joining Date"
              type="date"
              error={errors.joiningDate?.message}
              disabled={isSubmitting || isGeneralDisabled}
              {...register('joiningDate')}
            />
            <Input
              id="yExp"
              label="Years of Experience"
              placeholder="e.g. 5"
              type="number"
              error={errors.yearsOfExperience?.message}
              disabled={isSubmitting || isGeneralDisabled}
              {...register('yearsOfExperience', { valueAsNumber: true })}
            />
            <Input
              id="sScore"
              label="Safety Score (0-100)"
              placeholder="e.g. 95"
              type="number"
              error={errors.safetyScore?.message}
              disabled={isSubmitting || isComplianceDisabled}
              {...register('safetyScore', { valueAsNumber: true })}
            />
            <Input
              id="vAssigned"
              label="Assigned Vehicle (Reg Number)"
              placeholder="e.g. MH-12-PQ-4567"
              error={errors.assignedVehicle?.message}
              disabled={isSubmitting || isVehicleDisabled}
              {...register('assignedVehicle')}
            />
            <Select
              id="status-sel"
              label="Current Status"
              options={statusOptions}
              error={errors.status?.message}
              disabled={isSubmitting || isStatusDisabled}
              {...register('status')}
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
              <span>Save Driver</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
