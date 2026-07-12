import React from 'react';
import { cn } from '../../utils/cn';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'System Error Encountered',
  message = 'An unexpected error occurred while processing the request. Please retry or contact the administrator.',
  onRetry,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center border border-[#2C2C2C] bg-[#111111] w-full select-none", className)}>
      <div className="w-14 h-14 border border-red-900/30 bg-red-900/10 flex items-center justify-center mb-4">
        <AlertTriangle size={24} className="text-red-500" />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 font-mono mb-1">{title}</h3>
      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wide max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="secondary" onClick={onRetry} className="h-8 text-[10px]">
            Retry Operation
          </Button>
        </div>
      )}
    </div>
  );
};
