import React from 'react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, options, placeholder, id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error && id ? `${id}-error` : undefined}
            className={cn(
              "flex h-10 w-full rounded-none border border-[#2C2C2C] bg-[#141416] px-3 py-2 pr-10 text-sm text-white placeholder-[#8E8E93] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
              error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" className="bg-[#141416] text-[#8E8E93]">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#141416] text-white">
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#A1A1AA]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p id={id ? `${id}-error` : undefined} role="alert" className="font-mono text-xs text-[#EF4444] mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
