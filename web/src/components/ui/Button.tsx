import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-sans text-xs uppercase tracking-widest font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:opacity-50 disabled:cursor-not-allowed h-12 px-6 py-3 rounded-md select-none cursor-pointer",
          variant === 'primary' && "bg-transparent text-white border-2 border-white hover:bg-white hover:text-black active:bg-gray-200",
          variant === 'secondary' && "bg-[#111111] text-[#FFFFFF] border-[#333333] hover:bg-[#222222] hover:border-gray-500",
          variant === 'ghost' && "bg-transparent text-[#A3A3A3] border-transparent hover:bg-[#222222] hover:text-white",
          variant === 'danger' && "bg-[#991B1B] text-white border-[#991B1B] hover:bg-[#7F1D1D] active:bg-[#581C1C]",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : children}
      </button>
    );
  }
);
Button.displayName = 'Button';
