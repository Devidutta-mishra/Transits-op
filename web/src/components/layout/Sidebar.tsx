import React, { useState, useEffect } from 'react';
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
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
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
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-60';

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-[18px] left-14 z-30 md:hidden p-1 text-[#8E8E93] hover:text-white cursor-pointer"
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          "fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-[#111111] border-r border-[#333333] z-30 flex flex-col justify-between font-sans transition-all duration-200",
          sidebarWidth,
          "hidden md:flex",
          isMobileOpen && "!flex !w-60 !z-40"
        )}
      >
        {/* Desktop collapse toggle */}
        <div className="hidden md:flex items-center justify-end px-2 pt-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-[#8E8E93] hover:text-white hover:bg-[#1C1C20] transition-colors cursor-pointer"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>

        {/* Mobile close */}
        {isMobileOpen && (
          <div className="flex md:hidden items-center justify-end px-2 pt-2">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 text-[#8E8E93] hover:text-white cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <nav className="flex-1 py-2 flex flex-col gap-0.5" aria-label="Primary">
          {SIDEBAR_ITEMS.map((item) => {
            if (!hasPermission(item.permission)) return null;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 text-xs tracking-wider font-bold border-l-2 transition-all uppercase select-none cursor-pointer",
                    isCollapsed && !isMobileOpen && "justify-center px-0",
                    isActive
                      ? "bg-[#222222] text-white border-white"
                      : "text-[#A3A3A3] border-transparent hover:bg-[#222222] hover:text-white"
                  )
                }
                aria-label={item.name}
              >
                {({ isActive }) => {
                  const Icon = item.icon;
                  return (
                    <>
                      <span className={isActive ? "text-white" : "text-[#A3A3A3]"}>
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      {(!isCollapsed || isMobileOpen) && <span>{item.name}</span>}
                    </>
                  );
                }}
              </NavLink>
            );
          })}
        </nav>

        {(!isCollapsed || isMobileOpen) && (
          <div className="p-4 border-t border-[#333333] text-[10px] text-[#A3A3A3] font-mono tracking-widest uppercase">
            <span>CONSOLE V1.0.0</span>
          </div>
        )}
      </aside>
    </>
  );
};

export const useSidebarWidth = (): string => {
  return 'pl-60 md:pl-60';
};
