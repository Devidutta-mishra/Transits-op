import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error && id ? `${id}-error` : undefined}
          className={cn(
            "flex h-10 w-full rounded-none border border-[#2C2C2C] bg-[#141416] px-3 py-2 text-sm text-white placeholder-[#8E8E93] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]",
            className
          )}
          {...props}
        />
        {error && (
          <p id={id ? `${id}-error` : undefined} role="alert" className="font-mono text-xs text-[#EF4444] mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
