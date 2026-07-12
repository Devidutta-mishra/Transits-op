import React from 'react';

interface TripAnalyticsProps {
  avgTripTime: string;
  avgTripDistance: number;
  tripsPerVehicle: number;
  tripsPerDriver: number;
  onTimePercentage: number;
  cancelledTripsCount: number;
}

export const TripAnalytics: React.FC<TripAnalyticsProps> = ({
  avgTripTime,
  avgTripDistance,
  tripsPerVehicle,
  tripsPerDriver,
  onTimePercentage,
  cancelledTripsCount,
}) => {
  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Trip & Dispatch Summary
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Trip Metrics</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Avg Trip Duration</span>
          <span className="text-white text-base font-bold">{avgTripTime}</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Avg Trip Distance</span>
          <span className="text-white text-base font-bold">{avgTripDistance.toFixed(0)} km</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Trips / Vehicle</span>
          <span className="text-white text-base font-bold">{tripsPerVehicle.toFixed(1)}</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-gray-500 uppercase">Trips / Driver</span>
          <span className="text-white text-base font-bold">{tripsPerDriver.toFixed(1)}</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-green-500 uppercase font-bold">On-Time Rate</span>
          <span className="text-green-500 text-base font-bold">{onTimePercentage.toFixed(1)}%</span>
        </div>
        <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-3 flex flex-col gap-1 hover:border-[#D97706]/20 transition-colors">
          <span className="text-[9px] text-red-500 uppercase font-bold">Cancelled Trips</span>
          <span className="text-red-500 text-base font-bold">{cancelledTripsCount} Runs</span>
        </div>
      </div>
    </div>
  );
};
