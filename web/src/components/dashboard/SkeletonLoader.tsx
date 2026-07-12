import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonLoaderProps {
  variant: 'cards' | 'table' | 'chart' | 'activity';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant, count = 4 }) => {
  return (
    <div className="animate-pulse flex flex-col gap-4 w-full">
      {variant === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="h-28 bg-[#1C1C20] border border-[#2C2C2C] flex flex-col justify-between p-4 rounded-none">
              <div className="flex justify-between items-center">
                <div className="h-2.5 w-20 bg-gray-700 rounded-none" />
                <div className="h-3 w-3 bg-gray-700 rounded-none" />
              </div>
              <div className="h-6 w-24 bg-gray-700 rounded-none mt-4" />
              <div className="h-2 w-32 bg-gray-700 rounded-none mt-auto" />
            </div>
          ))}
        </div>
      )}

      {variant === 'table' && (
        <div className="border border-[#2C2C2C] bg-[#111111] p-4 flex flex-col gap-3 rounded-none w-full">
          <div className="grid grid-cols-8 gap-4 border-b border-[#2C2C2C] pb-3">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-3 bg-gray-700 rounded-none" />
            ))}
          </div>
          {Array.from({ length: 4 }).map((_, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-8 gap-4 py-2 border-b border-[#2C2C2C]/30 last:border-b-0">
              {Array.from({ length: 8 }).map((_, colIdx) => (
                <div key={colIdx} className={cn("h-2.5 bg-gray-800 rounded-none", colIdx === 0 ? "w-12 bg-gray-700" : "w-16")} />
              ))}
            </div>
          ))}
        </div>
      )}

      {variant === 'chart' && (
        <div className="border border-[#2C2C2C] bg-[#111111] p-6 h-64 flex flex-col gap-4 rounded-none w-full">
          <div className="flex justify-between items-center border-b border-[#2C2C2C] pb-2">
            <div className="h-3 w-36 bg-gray-700 rounded-none" />
            <div className="h-3 w-16 bg-gray-700 rounded-none" />
          </div>
          <div className="flex-1 flex items-end gap-6 px-4">
            {Array.from({ length: 7 }).map((_, idx) => (
              <div
                key={idx}
                style={{ height: `${20 + (idx * 10)}%` }}
                className="flex-1 bg-gray-800 rounded-none"
              />
            ))}
          </div>
        </div>
      )}

      {variant === 'activity' && (
        <div className="border border-[#2C2C2C] bg-[#111111] p-4 flex flex-col gap-4 rounded-none w-full">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="flex gap-3 py-2 border-b border-[#2C2C2C]/30 last:border-b-0">
              <div className="w-1.5 h-1.5 bg-gray-700 rounded-none mt-1.5" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-2.5 bg-gray-800 rounded-none w-3/4" />
                <div className="h-2 bg-gray-800 rounded-none w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
