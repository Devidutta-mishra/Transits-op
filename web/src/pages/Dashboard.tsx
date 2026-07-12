import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import { ROLE_LABELS } from '../constants/permissions';
import { Badge } from '../components/ui/Badge';
import type { Permission } from '../types/auth';
import { 
  Truck, 
  Users, 
  Route, 
  Wrench, 
  Fuel, 
  BarChart3, 
  Settings 
} from 'lucide-react';

interface ModuleConfig {
  name: string;
  path: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  permission: Permission;
}

const ALL_MODULES: ModuleConfig[] = [
  { name: 'Fleet', path: '/fleet', icon: Truck, description: 'Manage commercial vehicles, licenses, statuses, and availability logs.', permission: 'view:fleet' },
  { name: 'Drivers', path: '/drivers', icon: Users, description: 'Track driver manifests, shifts, and hours-of-service compliance limits.', permission: 'view:drivers' },
  { name: 'Trips', path: '/trips', icon: Route, description: 'Dispatch cargo containers, assign trailers, and monitor active ETAs.', permission: 'view:trips' },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench, description: 'Monitor engine codes, schedule inspections, and log repair items.', permission: 'view:maintenance' },
  { name: 'Fuel & Expenses', path: '/fuel', icon: Fuel, description: 'Audit fuel card logs, toll receipts, and operational expenses.', permission: 'view:fuel' },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, description: 'Generate monthly trips summaries, mileage, and cost logs.', permission: 'view:analytics' },
  { name: 'Settings', path: '/settings', icon: Settings, description: 'Manage roles, permission overrides, and system settings.', permission: 'view:settings' },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermission();

  if (!user) return null;

  const allowedModules = ALL_MODULES.filter((module) => hasPermission(module.permission));
  const restrictedCount = ALL_MODULES.length - allowedModules.length;

  return (
    <div className="flex flex-col gap-6 font-mono text-left">
      <div className="border-b border-[#2C2C2C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">
            OPERATIONS CONTROL CENTER
          </h1>
          <p className="text-xs text-[#8E8E93] mt-1 tracking-wide">
            WELCOME BACK, {user.name.toUpperCase()} (ID: {user.id.toUpperCase()})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8E8E93] uppercase tracking-wider">ACTIVE_ROLE:</span>
          <Badge variant="orange">{ROLE_LABELS[user.role]}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-[#2C2C2C] bg-[#141416] p-4 flex flex-col gap-1.5">
          <span className="text-[10px] text-[#8E8E93] uppercase tracking-widest font-bold">SESSION_STATUS</span>
          <span className="text-sm font-bold text-green-500 uppercase">AUTHENTICATED_ACTIVE</span>
          <span className="text-[10px] text-[#8E8E93] font-mono leading-none">PERSISTENCE: LOCAL_STORAGE</span>
        </div>
        <div className="border border-[#2C2C2C] bg-[#141416] p-4 flex flex-col gap-1.5">
          <span className="text-[10px] text-[#8E8E93] uppercase tracking-widest font-bold">AUTHORIZED_MODULES</span>
          <span className="text-sm font-bold text-white uppercase">{allowedModules.length} / {ALL_MODULES.length} ENABLED</span>
          <span className="text-[10px] text-[#8E8E93] font-mono leading-none">RESTRICTED_MODULES: {restrictedCount}</span>
        </div>
        <div className="border border-[#2C2C2C] bg-[#141416] p-4 flex flex-col gap-1.5">
          <span className="text-[10px] text-[#8E8E93] uppercase tracking-widest font-bold">RBAC_SECURITY_POLICY</span>
          <span className="text-sm font-bold text-[#D97706] uppercase">STRICT_ENFORCEMENT</span>
          <span className="text-[10px] text-[#8E8E93] font-mono leading-none">COMPLIANCE: VERIFIED</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#A1A1AA]">
          AUTHORIZED OPERATIONAL DECK
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allowedModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link 
                key={module.path} 
                to={module.path}
                className="border border-[#2C2C2C] bg-[#141416] p-5 flex items-start gap-4 hover:border-[#D97706] group transition-colors select-none"
              >
                <div className="p-2 border border-[#2C2C2C] bg-[#0F0F10] text-[#8E8E93] group-hover:text-[#D97706] group-hover:border-[#D97706] transition-colors">
                  <Icon size={20} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#D97706] transition-colors">
                    {module.name}
                  </span>
                  <p className="text-xs text-[#8E8E93] font-sans leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
