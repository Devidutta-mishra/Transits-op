import React from 'react';
import type { DriverCompliance } from '../../mock/reports';
import { cn } from '../../utils/cn';

interface ComplianceReportProps {
  compliances: DriverCompliance[];
}

export const ComplianceReport: React.FC<ComplianceReportProps> = ({ compliances }) => {
  const getStatusColor = (status: DriverCompliance['complianceStatus']) => {
    if (status === 'Compliant') return 'bg-green-600/10 text-green-500 border-green-600/30';
    if (status === 'Warning') return 'bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30';
    return 'bg-red-600/10 text-red-500 border-red-600/30';
  };

  const getLicenseColor = (lic: DriverCompliance['licenseStatus']) => {
    if (lic === 'Active') return 'text-green-500';
    if (lic === 'Suspended') return 'text-[#D97706] font-bold';
    return 'text-red-500 font-bold';
  };

  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Driver Compliance Report
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Safety & Audit Roster</span>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="text-[9px] uppercase font-bold text-gray-400 border-b border-[#2C2C2C]">
              <th className="p-2">Driver Name</th>
              <th className="p-2">License Status</th>
              <th className="p-2 text-right">Safety Score</th>
              <th className="p-2 text-right">Violations</th>
              <th className="p-2 text-center">Training</th>
              <th className="p-2 text-center">Medical Cert</th>
              <th className="p-2 text-center">Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2C2C2C]/30">
            {compliances.map((c) => (
              <tr key={c.driverName} className="hover:bg-[#1C1C20] transition-colors">
                <td className="p-2 text-white font-sans font-bold whitespace-nowrap">{c.driverName}</td>
                <td className="p-2 whitespace-nowrap">
                  <span className={cn("text-[10px] font-bold uppercase", getLicenseColor(c.licenseStatus))}>
                    {c.licenseStatus}
                  </span>
                </td>
                <td className="p-2 text-right text-white font-semibold">{c.safetyScore}/100</td>
                <td className="p-2 text-right text-red-500 font-bold">{c.violations}</td>
                <td className="p-2 text-center whitespace-nowrap">
                  <span className={cn(
                    "text-[9px] font-semibold",
                    c.trainingStatus === 'Completed' ? 'text-green-500' : 'text-gray-500'
                  )}>
                    {c.trainingStatus.toUpperCase()}
                  </span>
                </td>
                <td className="p-2 text-center whitespace-nowrap">
                  <span className={cn(
                    "text-[9px] font-semibold",
                    c.medicalCertificate === 'Valid' ? 'text-green-500' : 'text-red-500'
                  )}>
                    {c.medicalCertificate.toUpperCase()}
                  </span>
                </td>
                <td className="p-2 text-center whitespace-nowrap">
                  <span className={cn(
                    "inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold uppercase border rounded-none",
                    getStatusColor(c.complianceStatus)
                  )}>
                    {c.complianceStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
