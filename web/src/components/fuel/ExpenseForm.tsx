import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ExpenseRecord } from '../../mock/expenses';
import type { Vehicle } from '../../mock/vehicles';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X, Save } from 'lucide-react';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseRecord) => void;
  existingExpenses: ExpenseRecord[];
  vehicles: Vehicle[];
  currentUser: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingExpenses,
  vehicles,
  currentUser,
}) => {
  if (!isOpen) return null;

  const formSchema = z.object({
    expenseId: z.string().min(1, 'Expense ID is required.')
      .refine(
        (val) => !existingExpenses.map(e => e.expenseId.toLowerCase()).includes(val.toLowerCase()),
        { message: 'Expense ID must be unique.' }
      ),
    vehicleReg: z.string().min(1, 'Vehicle is required.'),
    category: z.enum([
      'Fuel', 'Repair', 'Maintenance', 'Insurance', 'Toll', 
      'Parking', 'Tyres', 'Registration', 'Driver Allowance', 'Miscellaneous'
    ] as const, { message: 'Category is required.' }),
    description: z.string().min(1, 'Description is required.'),
    amount: z.number().min(0.1, 'Expense Amount must be positive.'),
    paymentMethod: z.enum(['Corporate Card', 'Cash', 'Bank Transfer', 'UPI'] as const, {
      message: 'Payment Method is required.',
    }),
    approvedBy: z.string().min(1, 'Approver authorization is required.'),
    status: z.enum(['Pending', 'Approved', 'Rejected', 'Paid'] as const, {
      message: 'Status is required.',
    }),
    expenseDate: z.string().min(1, 'Expense Date is required.')
      .refine(
        (val) => new Date(val) <= new Date('2026-07-12'),
        { message: 'Expense Date cannot be in the future.' }
      ),
    invoiceNumber: z.string().min(1, 'Invoice Number is required.'),
    remarks: z.string(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expenseId: '',
      vehicleReg: '',
      category: 'Toll',
      description: '',
      amount: 0,
      paymentMethod: 'UPI',
      approvedBy: currentUser,
      status: 'Pending',
      expenseDate: new Date().toISOString().split('T')[0],
      invoiceNumber: '',
      remarks: '',
    },
  });

  const activeVehicles = vehicles.filter(v => v.status !== 'Retired');

  const vehicleOptions = activeVehicles.map(v => ({
    value: v.registrationNumber,
    label: `${v.registrationNumber} - ${v.vehicleName} (${v.status})`,
  }));

  const categoryOptions = [
    { value: 'Fuel', label: 'Fuel' },
    { value: 'Repair', label: 'Repair' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Toll', label: 'Toll' },
    { value: 'Parking', label: 'Parking' },
    { value: 'Tyres', label: 'Tyres' },
    { value: 'Registration', label: 'Registration' },
    { value: 'Driver Allowance', label: 'Driver Allowance' },
    { value: 'Miscellaneous', label: 'Miscellaneous' },
  ];

  const paymentMethodOptions = [
    { value: 'Corporate Card', label: 'Corporate Card' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'UPI', label: 'UPI' },
  ];

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Paid', label: 'Paid' },
  ];

  const handleFormSubmit = (data: FormValues) => {
    const expenseData: ExpenseRecord = {
      ...data,
      archived: false,
    };
    onSubmit(expenseData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 font-sans select-none overflow-y-auto">
      <div className="max-w-2xl w-full border border-[#2C2C2C] bg-[#111111] p-6 text-left relative flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#D97706]" />

        <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-4 mb-4 font-mono">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Log Operational Expense Record
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="expenseId"
              label="Expense ID"
              placeholder="e.g. EXP-2026-0001"
              error={errors.expenseId?.message}
              disabled={isSubmitting}
              {...register('expenseId')}
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
              id="cat-sel"
              label="Expense Category"
              options={categoryOptions}
              error={errors.category?.message}
              disabled={isSubmitting}
              {...register('category')}
            />
            <Input
              id="amount"
              label="Amount (INR)"
              placeholder="e.g. 2500"
              type="number"
              error={errors.amount?.message}
              disabled={isSubmitting}
              {...register('amount', { valueAsNumber: true })}
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
              id="approver"
              label="Authorized Approver"
              placeholder="e.g. Amit Sharma"
              error={errors.approvedBy?.message}
              disabled={isSubmitting}
              {...register('approvedBy')}
            />
            <Select
              id="status-sel"
              label="Expense Status"
              options={statusOptions}
              error={errors.status?.message}
              disabled={isSubmitting}
              {...register('status')}
            />
            <Input
              id="invoice"
              label="Invoice / Bill Number"
              placeholder="e.g. INV-88210"
              error={errors.invoiceNumber?.message}
              disabled={isSubmitting}
              {...register('invoiceNumber')}
            />
            <Input
              id="date"
              label="Expense Date"
              type="date"
              error={errors.expenseDate?.message}
              disabled={isSubmitting}
              {...register('expenseDate')}
            />
            <div className="sm:col-span-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block font-mono">
                Expense Description
              </label>
              <textarea
                id="desc"
                placeholder="Diagnostic items details, transit toll locations, insurance agency terms..."
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
            <div className="sm:col-span-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block font-mono">
                Remarks / Approval Audits
              </label>
              <textarea
                id="remarks"
                placeholder="Manager specific review flags, reimbursement status comments..."
                rows={2}
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
              <span>Save Expense</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
