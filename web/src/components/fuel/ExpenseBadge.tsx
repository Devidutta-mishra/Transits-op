import React from 'react';
import { cn } from '../../utils/cn';
import type { ExpenseStatus } from '../../mock/expenses';

interface ExpenseBadgeProps {
  status: ExpenseStatus;
}

export const ExpenseBadge: React.FC<ExpenseBadgeProps> = ({ status }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider rounded-none border select-none",
        status === 'Pending' && "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30",
        status === 'Approved' && "bg-blue-600/10 text-blue-400 border-blue-600/30",
        status === 'Rejected' && "bg-red-600/10 text-red-500 border-red-600/30",
        status === 'Paid' && "bg-green-600/10 text-green-500 border-green-600/30"
      )}
    >
      {status}
    </span>
  );
};
