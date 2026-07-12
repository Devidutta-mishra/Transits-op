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
            "flex h-12 w-full rounded-md border border-white bg-[#222222] px-4 py-3 text-sm text-white placeholder-[#A3A3A3] transition-all focus:border-white focus:outline-none focus:ring-1 focus:ring-white disabled:cursor-not-allowed disabled:opacity-50",
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
