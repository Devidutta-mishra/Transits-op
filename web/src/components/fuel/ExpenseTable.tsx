import React, { useState } from 'react';
import { MoreHorizontal, Eye, Check, X, ShieldAlert, Trash2, ArrowUpDown } from 'lucide-react';
import type { ExpenseRecord } from '../../mock/expenses';
import type { Role } from '../../types/auth';
import { ExpenseBadge } from './ExpenseBadge';

interface ExpenseTableProps {
  expenses: ExpenseRecord[];
  onView: (expense: ExpenseRecord) => void;
  onApprove: (expense: ExpenseRecord) => void;
  onReject: (expense: ExpenseRecord) => void;
  onPay: (expense: ExpenseRecord) => void;
  onOpenDelete: (expense: ExpenseRecord) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  role: Role;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  onView,
  onApprove,
  onReject,
  onPay,
  onOpenDelete,
  sortField,
  sortDirection,
  onSort,
  role,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleMenu = (expenseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMenuId === expenseId) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(expenseId);
    }
  };

  React.useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const formatCost = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return <ArrowUpDown size={10} className="text-gray-600 ml-1 inline" />;
    return (
      <span className="text-[#D97706] ml-1 font-bold">
        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
      </span>
    );
  };

  const canApprove = role === 'FLEET_MANAGER' || role === 'FINANCIAL_ANALYST';

  return (
    <div className="w-full border border-[#2C2C2C] bg-[#111111] overflow-x-auto select-none relative max-h-[500px]">
      <table className="w-full text-left font-mono text-xs border-collapse">
        <thead className="sticky top-0 z-10 bg-[#0F0F10] border-b border-[#2C2C2C]">
          <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('id')}>
              Expense ID {renderSortIndicator('id')}
            </th>
            <th className="p-3">Vehicle</th>
            <th className="p-3">Category</th>
            <th className="p-3">Description</th>
            <th className="p-3 text-right cursor-pointer select-none hover:text-white" onClick={() => onSort('amount')}>
              Amount {renderSortIndicator('amount')}
            </th>
            <th className="p-3">Pay Method</th>
            <th className="p-3">Approved By</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 cursor-pointer select-none hover:text-white" onClick={() => onSort('date')}>
              Date {renderSortIndicator('date')}
            </th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2C2C2C]/50">
          {expenses.map((expense) => (
            <tr key={expense.expenseId} className="hover:bg-[#1C1C20] transition-colors">
              <td className="p-3 font-bold text-[#D97706] whitespace-nowrap">
                {expense.expenseId}
              </td>
              <td className="p-3 text-[#D97706] font-bold whitespace-nowrap">{expense.vehicleReg}</td>
              <td className="p-3 text-white font-sans whitespace-nowrap">{expense.category}</td>
              <td className="p-3 text-gray-300 font-sans truncate max-w-xs" title={expense.description}>
                {expense.description}
              </td>
              <td className="p-3 text-white text-right pr-6 font-bold whitespace-nowrap">{formatCost(expense.amount)}</td>
              <td className="p-3 text-gray-300 whitespace-nowrap">{expense.paymentMethod}</td>
              <td className="p-3 text-gray-400 font-sans whitespace-nowrap">{expense.approvedBy || '-'}</td>
              <td className="p-3 text-center">
                <ExpenseBadge status={expense.status} />
              </td>
              <td className="p-3 text-gray-400 whitespace-nowrap">{formatDate(expense.expenseDate)}</td>
              <td className="p-3 text-right relative">
                <button
                  onClick={(e) => toggleMenu(expense.expenseId, e)}
                  className="p-1 hover:bg-[#2C2C2C] text-gray-400 hover:text-white rounded-none cursor-pointer inline-flex items-center"
                >
                  <MoreHorizontal size={14} />
                </button>

                {activeMenuId === expense.expenseId && (
                  <div className="absolute right-3 top-10 w-40 bg-[#141416] border border-[#2C2C2C] z-20 flex flex-col font-mono text-[10px] uppercase tracking-wider rounded-none shadow-xl select-none">
                    <button
                      onClick={() => onView(expense)}
                      className="flex items-center gap-2 px-3 py-2 text-left text-gray-300 hover:bg-[#1C1C20] hover:text-white cursor-pointer"
                    >
                      <Eye size={12} className="text-[#D97706]" />
                      <span>View Details</span>
                    </button>

                    {canApprove && (
                      <>
                        {expense.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => onApprove(expense)}
                              className="flex items-center gap-2 px-3 py-2 text-left text-blue-400 hover:bg-[#1C1C20] hover:text-blue-300 cursor-pointer"
                            >
                              <Check size={12} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => onReject(expense)}
                              className="flex items-center gap-2 px-3 py-2 text-left text-red-400 hover:bg-[#1C1C20] hover:text-red-300 cursor-pointer"
                            >
                              <X size={12} />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        {expense.status === 'Approved' && (
                          <button
                            onClick={() => onPay(expense)}
                            className="flex items-center gap-2 px-3 py-2 text-left text-green-500 hover:bg-[#1C1C20] hover:text-green-400 cursor-pointer"
                          >
                            <ShieldAlert size={12} />
                            <span>Mark Paid</span>
                          </button>
                        )}
                        <div className="border-t border-[#2C2C2C]" />
                        <button
                          onClick={() => onOpenDelete(expense)}
                          className="flex items-center gap-2 px-3 py-2 text-left text-red-500 hover:bg-[#991B1B]/15 hover:text-red-600 cursor-pointer font-bold"
                        >
                          <Trash2 size={12} />
                          <span>Delete Expense</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
