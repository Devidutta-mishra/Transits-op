import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePermission } from '../../hooks/usePermission';
import type { Permission } from '../../types/auth';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Route, 
  Wrench, 
  Fuel, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  permission: Permission;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'DASHBOARD', path: '/', icon: LayoutDashboard, permission: 'view:dashboard' },
  { name: 'FLEET', path: '/fleet', icon: Truck, permission: 'view:fleet' },
  { name: 'DRIVERS', path: '/drivers', icon: Users, permission: 'view:drivers' },
  { name: 'TRIPS', path: '/trips', icon: Route, permission: 'view:trips' },
  { name: 'MAINTENANCE', path: '/maintenance', icon: Wrench, permission: 'view:maintenance' },
  { name: 'FUEL & EXPENSES', path: '/fuel', icon: Fuel, permission: 'view:fuel' },
  { name: 'ANALYTICS', path: '/analytics', icon: BarChart3, permission: 'view:analytics' },
  { name: 'SETTINGS', path: '/settings', icon: Settings, permission: 'view:settings' },
];

export const Sidebar: React.FC = () => {
  const { hasPermission } = usePermission();

  return (
    <aside className="fixed left-0 top-14 w-60 h-[calc(100vh-3.5rem)] bg-[#141416] border-r border-[#2C2C2C] z-20 flex flex-col justify-between font-mono">
      <nav className="flex-1 py-4 flex flex-col gap-1">
        {SIDEBAR_ITEMS.map((item) => {
          if (!hasPermission(item.permission)) return null;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 text-xs tracking-wider font-semibold border-l-2 transition-all uppercase select-none cursor-pointer",
                  isActive
                    ? "bg-[#1C1C20] text-white border-[#D97706]"
                    : "text-[#8E8E93] border-transparent hover:bg-[#1C1C20] hover:text-white"
                )
              }
            >
              {({ isActive }) => {
                const Icon = item.icon;
                return (
                  <>
                    <span className={isActive ? "text-[#D97706]" : "text-[#8E8E93]"}>
                      <Icon size={16} />
                    </span>
                    <span>{item.name}</span>
                  </>
                );
              }}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2C2C2C] text-[10px] text-[#8E8E93] tracking-widest uppercase">
        <span>CONSOLE V1.0.0</span>
      </div>
    </aside>
  );
};
