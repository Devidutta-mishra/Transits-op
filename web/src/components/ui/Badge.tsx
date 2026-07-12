import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'orange' | 'outline' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider rounded-none select-none border",
        variant === 'default' && "bg-[#1C1C20] text-white border-[#2C2C2C]",
        variant === 'orange' && "bg-[#D97706] text-white border-[#D97706]",
        variant === 'outline' && "bg-transparent text-[#A1A1AA] border-[#2C2C2C]",
        variant === 'danger' && "bg-[#991B1B]/20 text-[#EF4444] border-[#991B1B]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
