import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className }) => {
  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn("w-full bg-zinc-800 h-2 border border-zinc-700 select-none", className)}>
      <div
        className="bg-[#D97706] h-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
