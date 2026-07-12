import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-2 mb-4 select-none">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-[#D97706]" />
        <div className="flex flex-col text-left">
          <h2 className="text-xs uppercase font-bold tracking-wider text-white font-sans">
            {title}
          </h2>
          {subtitle && (
            <span className="text-[10px] text-gray-500 font-sans tracking-wide">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};
