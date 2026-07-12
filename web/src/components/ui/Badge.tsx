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
        variant === 'default' && "bg-transparent text-white border-white",
        variant === 'orange' && "bg-white text-black border-white",
        variant === 'outline' && "bg-transparent text-[#A3A3A3] border-[#333333]",
        variant === 'danger' && "bg-transparent text-white border-[#555555]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
