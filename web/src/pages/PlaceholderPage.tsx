import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ROLE_LABELS } from '../constants/permissions';

interface PlaceholderPageProps {
  title: string;
  moduleName: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, moduleName }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 font-mono text-left">
      <div className="border-b border-[#2C2C2C] pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">
            {title}
          </h1>
          <p className="text-xs text-[#8E8E93] mt-1 tracking-wide">
            SYSTEM_MODULE_IDENTIFIER: {moduleName.toUpperCase().replace(/ /g, '_')}_CORE_V1
          </p>
        </div>
        <div className="text-xs text-[#8E8E93] border border-[#2C2C2C] px-3 py-1 bg-[#141416] uppercase tracking-widest">
          ACCESS_LEVEL: {user ? ROLE_LABELS[user.role] : 'GUEST'}
        </div>
      </div>

      <div className="border border-[#2C2C2C] bg-[#141416] p-6 rounded-none relative">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D97706]" />
        <div className="pl-4 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Module Foundation Loaded
          </h2>
          <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-2xl font-sans">
            The {moduleName} module structure, layouts, navigation pathways, and access controls are fully operational. Access has been verified and authorized for your current system role. Business operations and data consoles will load here in the next development iteration.
          </p>

          <div className="mt-4 border border-[#2C2C2C] max-w-xl">
            <div className="grid grid-cols-2 bg-[#0F0F10] border-b border-[#2C2C2C] p-2 text-[10px] uppercase font-bold text-[#8E8E93] tracking-widest">
              <div>PARAMETER</div>
              <div>STATUS_VALUE</div>
            </div>
            <div className="grid grid-cols-2 p-2 text-xs border-b border-[#2C2C2C]/50">
              <div className="text-[#8E8E93]">MODULE_ID</div>
              <div className="text-white">MOD_{moduleName.toUpperCase().replace(/ /g, '_')}</div>
            </div>
            <div className="grid grid-cols-2 p-2 text-xs border-b border-[#2C2C2C]/50">
              <div className="text-[#8E8E93]">ROUTING_GUARD</div>
              <div className="text-green-500 font-bold">VERIFIED_ACTIVE</div>
            </div>
            <div className="grid grid-cols-2 p-2 text-xs">
              <div className="text-[#8E8E93]">INTERFACE_RENDER</div>
              <div className="text-[#D97706] font-bold">FLAT_UI_ENGINEERED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
