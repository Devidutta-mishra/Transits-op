import React from 'react';
import { Archive } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-8 text-center flex flex-col items-center justify-center select-none font-mono">
      <Archive className="text-gray-600 mb-3" size={24} />
      <h3 className="text-xs uppercase font-bold text-white tracking-widest">{title}</h3>
      <p className="text-[10px] text-gray-500 font-sans mt-1 leading-relaxed max-w-xs">{description}</p>
    </div>
  );
};
