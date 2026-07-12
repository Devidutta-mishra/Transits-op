import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../ui/Badge';
import { ROLE_LABELS } from '../../constants/permissions';
import { LogOut, Search } from 'lucide-react';

export const Topbar: React.FC = () => {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#141416] border-b border-[#2C2C2C] z-30 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[#D97706] flex items-center justify-center font-mono font-black text-black text-sm select-none">
          T
        </div>
        <span className="font-mono text-sm font-bold uppercase tracking-wider text-white">
          TransitOps
        </span>
      </div>

      <div className="flex-1 max-w-md mx-8 relative hidden md:block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8E8E93]">
          <Search size={14} />
        </span>
        <input
          type="text"
          placeholder="SEARCH CONSOLE (E.G. ASSET_ID, DRIVER_NAME)..."
          className="w-full h-8 pl-9 pr-3 bg-[#0F0F10] border border-[#2C2C2C] text-xs font-mono text-white placeholder-[#8E8E93] focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706] rounded-none uppercase tracking-wider"
        />
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-r border-[#2C2C2C] pr-4">
            <div className="text-right flex flex-col justify-center">
              <span className="text-xs font-semibold text-white leading-none">
                {user.name}
              </span>
              <span className="text-[10px] text-[#8E8E93] leading-none mt-1">
                {user.email}
              </span>
            </div>

            <Badge variant="orange">
              {ROLE_LABELS[user.role]}
            </Badge>

            <div className="w-8 h-8 bg-[#2C2C2C] border border-[#8E8E93]/20 flex items-center justify-center text-xs font-mono text-white font-bold select-none rounded-none">
              {getInitials(user.name)}
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 h-8 px-3 bg-[#1C1C20] border border-[#2C2C2C] text-xs font-mono font-semibold uppercase tracking-wider text-[#A1A1AA] hover:bg-[#991B1B] hover:text-white hover:border-[#991B1B] active:bg-[#7F1D1D] rounded-none cursor-pointer transition-colors"
          >
            <LogOut size={12} />
            <span>LOGOUT</span>
          </button>
        </div>
      )}
    </header>
  );
};
