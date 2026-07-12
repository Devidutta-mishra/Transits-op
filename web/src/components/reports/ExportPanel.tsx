import React from 'react';
import { FileSpreadsheet, FileText, Printer, Mail, Download } from 'lucide-react';

export const ExportPanel: React.FC = () => {
  const triggerPlaceholder = (type: string) => {
    alert(`BI_REPORT_EXPORT_TRIGGER // Initializing ${type} generator engine. Awaiting spools.`);
  };

  return (
    <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left select-none font-mono flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Executive Export Center
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold">BI Output</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mt-1">
        <button
          onClick={() => triggerPlaceholder('PDF Document')}
          className="flex items-center justify-center gap-2 h-9 bg-[#1C1C20] border border-[#2C2C2C] text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#111111] hover:border-[#D97706] transition-colors rounded-none cursor-pointer"
        >
          <FileText size={13} className="text-red-500" />
          <span>Export PDF</span>
        </button>
        <button
          onClick={() => triggerPlaceholder('Excel Spreadsheet')}
          className="flex items-center justify-center gap-2 h-9 bg-[#1C1C20] border border-[#2C2C2C] text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#111111] hover:border-[#D97706] transition-colors rounded-none cursor-pointer"
        >
          <FileSpreadsheet size={13} className="text-green-500" />
          <span>Export Excel</span>
        </button>
        <button
          onClick={() => triggerPlaceholder('CSV File')}
          className="flex items-center justify-center gap-2 h-9 bg-[#1C1C20] border border-[#2C2C2C] text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#111111] hover:border-[#D97706] transition-colors rounded-none cursor-pointer"
        >
          <Download size={13} className="text-blue-400" />
          <span>Download CSV</span>
        </button>
        <button
          onClick={() => triggerPlaceholder('Spool Print Job')}
          className="flex items-center justify-center gap-2 h-9 bg-[#1C1C20] border border-[#2C2C2C] text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#111111] hover:border-[#D97706] transition-colors rounded-none cursor-pointer"
        >
          <Printer size={13} className="text-gray-400" />
          <span>Print Report</span>
        </button>
        <button
          onClick={() => triggerPlaceholder('Email Broadcast')}
          className="flex items-center justify-center gap-2 h-9 bg-[#1C1C20] border border-[#2C2C2C] text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#111111] hover:border-[#D97706] transition-colors rounded-none cursor-pointer"
        >
          <Mail size={13} className="text-[#D97706]" />
          <span>Email Report</span>
        </button>
      </div>
    </div>
  );
};
