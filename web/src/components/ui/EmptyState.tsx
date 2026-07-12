import React from 'react';
import { cn } from '../../utils/cn';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  message = 'There are no entries matching the current filters or criteria.',
  icon: Icon = Inbox,
  action,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center border border-[#2C2C2C] bg-[#111111] w-full select-none", className)}>
      <div className="w-14 h-14 border border-[#2C2C2C] bg-[#0F0F10] flex items-center justify-center mb-4">
        <Icon size={24} className="text-gray-600" />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono mb-1">{title}</h3>
      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wide max-w-sm leading-relaxed">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
