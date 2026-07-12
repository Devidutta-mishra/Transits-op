import React from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle, CalendarRange } from 'lucide-react';

interface LicenseBadgeProps {
  expiryDateStr: string;
}

export const LicenseBadge: React.FC<LicenseBadgeProps> = ({ expiryDateStr }) => {
  const expiryDate = new Date(expiryDateStr);
  const today = new Date('2026-07-12');
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isExpired = diffDays <= 0;
  const isExpiringSoon = diffDays > 0 && diffDays <= 30;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider rounded-none select-none border",
        isExpired && "bg-[#DC2626]/10 text-[#EF4444] border-[#DC2626]/30 font-bold",
        isExpiringSoon && "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30 font-bold",
        !isExpired && !isExpiringSoon && "bg-transparent text-gray-400 border-transparent"
      )}
    >
      {isExpired && <AlertCircle size={10} className="text-[#EF4444]" />}
      {isExpiringSoon && <CalendarRange size={10} className="text-[#D97706]" />}
      <span>{formatDate(expiryDateStr)}</span>
      {isExpired && <span className="ml-1 text-[8px]">[EXPIRED]</span>}
      {isExpiringSoon && <span className="ml-1 text-[8px]">[EXPIRING SOON]</span>}
    </span>
  );
};
