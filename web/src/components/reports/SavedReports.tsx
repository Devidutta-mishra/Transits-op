import React from 'react';
import type { SavedReport } from '../../mock/reports';
import { Download, FileText } from 'lucide-react';

interface SavedReportsProps {
  reports: SavedReport[];
}

export const SavedReports: React.FC<SavedReportsProps> = ({ reports }) => {
  const triggerDownload = (report: SavedReport) => {
    alert(`DOWNLOAD_ARCHIVED_REPORT // File ${report.id} (${report.fileSize}) download spooled.`);
  };

  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Saved & Archived Reports
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">PDF Archives</span>
      </div>

      <div className="flex flex-col gap-2">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between p-3 border border-[#2C2C2C]/50 bg-[#0F0F10] hover:border-[#D97706]/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center border text-xs text-gray-400 bg-zinc-800/20 border-zinc-700/20">
                <FileText size={14} className="text-[#D97706]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-white font-sans font-bold uppercase leading-tight">
                  {report.name}
                </span>
                <span className="text-[8px] text-gray-500 mt-1 uppercase">
                  Category: {report.category} // Generated: {report.lastGenerated}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => triggerDownload(report)}
              className="flex items-center justify-center w-8 h-8 bg-zinc-800 hover:bg-[#1C1C20] border border-[#2C2C2C] text-white hover:border-[#D97706] transition-colors rounded-none cursor-pointer"
              title={`Download ${report.fileSize}`}
            >
              <Download size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
