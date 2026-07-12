import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import { initialCompanyProfile, initialFleetSettings, initialSecuritySettings, initialNotificationSettings } from '../mock/settings';
import type { CompanyProfile } from '../mock/settings';
import { mockUsersList } from '../mock/users';
import type { AdminUser, AdminRole, AdminStatus } from '../mock/users';
import { mockAuditLogs } from '../mock/auditLogs';
import type { AuditLog } from '../mock/auditLogs';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { cn } from '../utils/cn';
import { SkeletonLoader } from '../components/dashboard/SkeletonLoader';
import { 
  Building, Users, Shield, Wrench, 
  HelpCircle, ChevronRight, Save, RotateCcw, ShieldCheck, 
  UserX, UserCheck, Key, Trash, Info, Search, FileText 
} from 'lucide-react';

const companySchema = z.object({
  companyName: z.string().min(1, 'Company Name is required.'),
  logoUrl: z.string(),
  companyEmail: z.string().min(1, 'Company Email is required.').email('Invalid email format.'),
  phone: z.string().min(1, 'Phone Number is required.'),
  website: z.string().min(1, 'Website URL is required.'),
  gstNumber: z.string().min(1, 'GST Number is required.'),
  headquarters: z.string().min(1, 'Headquarters location is required.'),
  address: z.string().min(1, 'Address is required.'),
  city: z.string().min(1, 'City is required.'),
  state: z.string().min(1, 'State is required.'),
  country: z.string().min(1, 'Country is required.'),
  zipCode: z.string().min(1, 'Zip Code is required.'),
  businessHours: z.string().min(1, 'Business Hours is required.'),
  emergencyContact: z.string().min(1, 'Emergency Contact is required.'),
});

export const AdministrationSettings: React.FC = () => {
  const { user } = useAuth();
  const { role } = usePermission();

  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'fleet' | 'security' | 'help'>('profile');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters for Audit Logs
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [auditUser, setAuditUser] = useState<string>('');
  const [auditModule, setAuditModule] = useState<string>('');
  const [auditAction, setAuditAction] = useState<string>('');

  useEffect(() => {
    setUsers(mockUsersList);
    setAuditLogs(mockAuditLogs);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Company Profile form
  const {
    register: regCompany,
    handleSubmit: handleCompanySubmit,
    reset: resetCompany,
    formState: { errors: compErrors },
  } = useForm<CompanyProfile>({
    resolver: zodResolver(companySchema),
    defaultValues: initialCompanyProfile,
  });

  const onCompanySave = (data: CompanyProfile) => {
    alert(`COMPANY_PROFILE_UPDATED // GST: ${data.gstNumber} saved in database.`);
  };

  // User management actions
  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.userId === userId) {
        const nextStatus: AdminStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const triggerResetPassword = (userId: string) => {
    alert(`SECURITY_BROADCAST // Reset password link spooled for user ID ${userId}.`);
  };

  const triggerDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.userId !== userId));
  };

  // Role permissions Matrix rows and columns
  const matrixModules = ['Dashboard', 'Vehicles', 'Drivers', 'Trips', 'Maintenance', 'Fuel', 'Expenses', 'Reports', 'Users', 'Settings'];
  const matrixRoles: { key: AdminRole; label: string }[] = [
    { key: 'Fleet Manager', label: 'Fleet Manager' },
    { key: 'Dispatcher', label: 'Dispatcher' },
    { key: 'Safety Officer', label: 'Safety Officer' },
    { key: 'Financial Analyst', label: 'Financial Analyst' },
    { key: 'Administrator', label: 'Administrator' },
  ];

  const defaultMatrixState: Record<string, Record<string, boolean>> = {};
  matrixModules.forEach(mod => {
    defaultMatrixState[mod] = {};
    matrixRoles.forEach(r => {
      // Fleet manager and Administrator have everything by default.
      if (r.key === 'Administrator' || r.key === 'Fleet Manager') {
        defaultMatrixState[mod][r.key] = true;
      } else if (r.key === 'Dispatcher') {
        defaultMatrixState[mod][r.key] = ['Dashboard', 'Vehicles', 'Drivers', 'Trips'].includes(mod);
      } else if (r.key === 'Safety Officer') {
        defaultMatrixState[mod][r.key] = ['Dashboard', 'Vehicles', 'Drivers', 'Maintenance'].includes(mod);
      } else if (r.key === 'Financial Analyst') {
        defaultMatrixState[mod][r.key] = ['Dashboard', 'Fuel', 'Expenses', 'Reports'].includes(mod);
      }
    });
  });

  const [matrixState, setMatrixState] = useState(defaultMatrixState);

  const toggleMatrixCheckbox = (mod: string, roleKey: string) => {
    setMatrixState(prev => {
      const updatedMod = { ...prev[mod], [roleKey]: !prev[mod][roleKey] };
      return { ...prev, [mod]: updatedMod };
    });
  };

  const savePermissionMatrix = () => {
    alert('SECURITY_POLICY_COMMITTED // System permissions matrix updated in database configuration.');
  };

  // Filtered audit logs
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchSearch = log.description.toLowerCase().includes(auditSearch.toLowerCase()) || log.logId.toLowerCase().includes(auditSearch.toLowerCase());
    const matchUser = !auditUser || log.user === auditUser;
    const matchModule = !auditModule || log.module === auditModule;
    const matchAction = !auditAction || log.action === auditAction;
    return matchSearch && matchUser && matchModule && matchAction;
  });

  if (!user || !role) return null;

  return (
    <div className="flex flex-col gap-6 text-left select-none font-sans">
      {/* Title Header */}
      <div className="border-b border-[#2C2C2C] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono tracking-widest uppercase">
            <span>Dashboard</span>
            <ChevronRight size={10} />
            <span className="text-white">Administration & Settings</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white mt-1 leading-none font-mono">
            ADMINISTRATION & SETTINGS
          </h1>
          <p className="text-[11px] text-gray-500 mt-2 font-mono tracking-wide">
            SYSTEM_CONFIGURATION_SHELL // CONSOLE MODE
          </p>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader variant="table" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Tabs Navigation Sidebar */}
          <div className="flex flex-col border border-[#2C2C2C] bg-[#111111] p-2 font-mono text-xs uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-left font-bold border-l-2 transition-all cursor-pointer",
                activeTab === 'profile'
                  ? "bg-[#1C1C20] text-white border-[#D97706]"
                  : "text-gray-500 border-transparent hover:text-white hover:bg-[#1C1C20]/40"
              )}
            >
              <Building size={14} className={activeTab === 'profile' ? 'text-[#D97706]' : 'text-gray-500'} />
              <span>Company Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-left font-bold border-l-2 transition-all cursor-pointer",
                activeTab === 'users'
                  ? "bg-[#1C1C20] text-white border-[#D97706]"
                  : "text-gray-500 border-transparent hover:text-white hover:bg-[#1C1C20]/40"
              )}
            >
              <Users size={14} className={activeTab === 'users' ? 'text-[#D97706]' : 'text-gray-500'} />
              <span>User & Permissions</span>
            </button>
            <button
              onClick={() => setActiveTab('fleet')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-left font-bold border-l-2 transition-all cursor-pointer",
                activeTab === 'fleet'
                  ? "bg-[#1C1C20] text-white border-[#D97706]"
                  : "text-gray-500 border-transparent hover:text-white hover:bg-[#1C1C20]/40"
              )}
            >
              <Wrench size={14} className={activeTab === 'fleet' ? 'text-[#D97706]' : 'text-gray-500'} />
              <span>Fleet & Notifications</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-left font-bold border-l-2 transition-all cursor-pointer",
                activeTab === 'security'
                  ? "bg-[#1C1C20] text-white border-[#D97706]"
                  : "text-gray-500 border-transparent hover:text-white hover:bg-[#1C1C20]/40"
              )}
            >
              <Shield size={14} className={activeTab === 'security' ? 'text-[#D97706]' : 'text-gray-500'} />
              <span>Security & Audits</span>
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-left font-bold border-l-2 transition-all cursor-pointer",
                activeTab === 'help'
                  ? "bg-[#1C1C20] text-white border-[#D97706]"
                  : "text-gray-500 border-transparent hover:text-white hover:bg-[#1C1C20]/40"
              )}
            >
              <HelpCircle size={14} className={activeTab === 'help' ? 'text-[#D97706]' : 'text-gray-500'} />
              <span>Help & Support</span>
            </button>
          </div>

          {/* Active Tab View */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* TAB 1: COMPANY PROFILE */}
            {activeTab === 'profile' && (
              <div className="border border-[#2C2C2C] bg-[#111111] p-6 text-left">
                <div className="border-b border-[#2C2C2C] pb-3 mb-5 font-mono flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Company Information</h3>
                  <span className="text-[10px] text-gray-500">Logistics HQ profile</span>
                </div>

                <form onSubmit={handleCompanySubmit(onCompanySave)} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input id="companyName" label="Company Name" placeholder="TransitOps Logistics" error={compErrors.companyName?.message} {...regCompany('companyName')} />
                    <Input id="companyEmail" label="Corporate Email" placeholder="ops@company.com" error={compErrors.companyEmail?.message} {...regCompany('companyEmail')} />
                    <Input id="phone" label="Main Phone Line" placeholder="+91 22..." error={compErrors.phone?.message} {...regCompany('phone')} />
                    <Input id="website" label="Website URL" placeholder="https://..." error={compErrors.website?.message} {...regCompany('website')} />
                    <Input id="gstNumber" label="GSTIN Number" placeholder="GST-12-XXX..." error={compErrors.gstNumber?.message} {...regCompany('gstNumber')} />
                    <Input id="headquarters" label="Fleet Headquarters" placeholder="Powai Yard" error={compErrors.headquarters?.message} {...regCompany('headquarters')} />
                    <Input id="address" label="Street Address" placeholder="Building 3..." error={compErrors.address?.message} {...regCompany('address')} />
                    <Input id="city" label="City" placeholder="Mumbai" error={compErrors.city?.message} {...regCompany('city')} />
                    <Input id="state" label="State / Province" placeholder="Maharashtra" error={compErrors.state?.message} {...regCompany('state')} />
                    <Input id="country" label="Country" placeholder="India" error={compErrors.country?.message} {...regCompany('country')} />
                    <Input id="zipCode" label="Zip / Postal Code" placeholder="400076" error={compErrors.zipCode?.message} {...regCompany('zipCode')} />
                    <Input id="businessHours" label="Operational Business Hours" placeholder="08:00 AM..." error={compErrors.businessHours?.message} {...regCompany('businessHours')} />
                    <div className="sm:col-span-2">
                      <Input id="emergencyContact" label="Emergency Contact Hotline" placeholder="+91 99999..." error={compErrors.emergencyContact?.message} {...regCompany('emergencyContact')} />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-[#2C2C2C] pt-4 font-mono text-[10px]">
                    <Button type="button" variant="secondary" onClick={() => resetCompany()} className="h-9">
                      <RotateCcw size={12} className="mr-1.5" />
                      <span>Reset Form</span>
                    </Button>
                    <Button type="submit" variant="primary" className="h-9">
                      <Save size={12} className="mr-1.5" />
                      <span>Save Profile</span>
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: USER MANAGEMENT & PERMISSIONS */}
            {activeTab === 'users' && (
              <div className="flex flex-col gap-6">
                {/* Users Table */}
                <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left">
                  <div className="border-b border-[#2C2C2C] pb-3 mb-4 font-mono flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">System User Roster</h3>
                    <span className="text-[10px] text-gray-500">Active Accounts: {users.length}</span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="text-[9px] uppercase font-bold text-gray-400 border-b border-[#2C2C2C]">
                          <th className="p-2">Name</th>
                          <th className="p-2">Role</th>
                          <th className="p-2">Department</th>
                          <th className="p-2">Email</th>
                          <th className="p-2">Status</th>
                          <th className="p-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2C2C2C]/30">
                        {users.map(u => (
                          <tr key={u.userId} className="hover:bg-[#1C1C20] transition-colors">
                            <td className="p-2 text-white font-sans font-bold whitespace-nowrap">{u.name}</td>
                            <td className="p-2 text-[#D97706] whitespace-nowrap">{u.role}</td>
                            <td className="p-2 text-gray-300 whitespace-nowrap">{u.department}</td>
                            <td className="p-2 text-gray-400 font-sans whitespace-nowrap">{u.email}</td>
                            <td className="p-2">
                              <span className={cn(
                                "text-[9px] font-bold px-1.5 py-0.5 border rounded-none uppercase",
                                u.status === 'Active' ? 'bg-green-600/10 text-green-500 border-green-600/20' : 'bg-zinc-800 text-gray-500 border-zinc-700'
                              )}>
                                {u.status}
                              </span>
                            </td>
                            <td className="p-2 text-right whitespace-nowrap">
                              <div className="flex justify-end gap-1.5 text-[9px] uppercase font-bold">
                                <button
                                  onClick={() => toggleUserStatus(u.userId)}
                                  className="p-1 border border-[#2C2C2C] bg-zinc-800 hover:bg-[#1C1C20] text-white hover:text-[#D97706] cursor-pointer inline-flex items-center"
                                  title={u.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                                >
                                  {u.status === 'Active' ? <UserX size={12} /> : <UserCheck size={12} />}
                                </button>
                                <button
                                  onClick={() => triggerResetPassword(u.userId)}
                                  className="p-1 border border-[#2C2C2C] bg-zinc-800 hover:bg-[#1C1C20] text-white hover:text-[#D97706] cursor-pointer inline-flex items-center"
                                  title="Reset Password"
                                >
                                  <Key size={12} />
                                </button>
                                <button
                                  onClick={() => triggerDeleteUser(u.userId)}
                                  className="p-1 border border-[#2C2C2C] bg-zinc-800 hover:bg-[#991B1B]/20 text-red-500 hover:text-red-600 cursor-pointer inline-flex items-center"
                                  title="Delete User"
                                >
                                  <Trash size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Role Permissions Matrix */}
                <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left">
                  <div className="border-b border-[#2C2C2C] pb-3 mb-4 font-mono flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">System Permission Matrix</h3>
                    <span className="text-[10px] text-gray-500 font-bold">Role access rules</span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left font-mono text-[10px] border-collapse">
                      <thead>
                        <tr className="text-gray-400 border-b border-[#2C2C2C] uppercase font-bold text-center">
                          <th className="p-2 text-left w-24">Module</th>
                          {matrixRoles.map(r => (
                            <th key={r.key} className="p-2 text-center w-28">{r.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2C2C2C]/30 text-center">
                        {matrixModules.map(mod => (
                          <tr key={mod} className="hover:bg-[#1C1C20] transition-colors">
                            <td className="p-2 text-left font-bold text-white uppercase">{mod}</td>
                            {matrixRoles.map(r => (
                              <td key={r.key} className="p-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={!!matrixState[mod]?.[r.key]}
                                  onChange={() => toggleMatrixCheckbox(mod, r.key)}
                                  className="h-3.5 w-3.5 bg-[#0F0F10] border border-[#2C2C2C] rounded-none checked:bg-[#D97706] checked:border-[#D97706] focus:ring-0 focus:outline-none cursor-pointer appearance-none checked:after:content-['✓'] checked:after:text-black checked:after:font-bold checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-[10px]"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-3 mt-4 border-t border-[#2C2C2C] pt-3 font-mono text-[10px]">
                    <Button onClick={savePermissionMatrix} variant="primary" className="h-9">
                      <ShieldCheck size={12} className="mr-1.5" />
                      <span>Commit Permissions</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: FLEET SETTINGS & NOTIFICATIONS */}
            {activeTab === 'fleet' && (
              <div className="flex flex-col gap-6">
                {/* Fleet settings */}
                <div className="border border-[#2C2C2C] bg-[#111111] p-6 text-left">
                  <div className="border-b border-[#2C2C2C] pb-3 mb-5 font-mono flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Fleet & Operations Parameters</h3>
                    <span className="text-[10px] text-gray-500">Measurement formats</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-mono text-xs">
                    <Select id="fuel-type" label="Default Fuel Type" options={[{ value: 'Diesel', label: 'Diesel' }, { value: 'Petrol', label: 'Petrol' }, { value: 'CNG', label: 'CNG' }]} defaultValue={initialFleetSettings.defaultFuelType} />
                    <Select id="dist-unit" label="Distance Metrics Unit" options={[{ value: 'km', label: 'Kilometers (km)' }, { value: 'miles', label: 'Miles (mi)' }]} defaultValue={initialFleetSettings.distanceUnit} />
                    <Select id="weight-unit" label="Cargo Weight Unit" options={[{ value: 'kg', label: 'Kilograms (kg)' }, { value: 'lbs', label: 'Pounds (lbs)' }, { value: 'tonnes', label: 'Tonnes (t)' }]} defaultValue={initialFleetSettings.weightUnit} />
                    <Select id="currency-unit" label="Currency Standard" options={[{ value: 'INR', label: 'Indian Rupee (₹)' }, { value: 'USD', label: 'US Dollar ($)' }]} defaultValue={initialFleetSettings.currency} />
                    <Input id="timeZone" label="System Time Zone" defaultValue={initialFleetSettings.timeZone} />
                    <Input id="lang" label="System Default Language" defaultValue={initialFleetSettings.defaultLanguage} />
                    <Input id="vFormat" label="Vehicle License Number Format" defaultValue={initialFleetSettings.vehicleNumberFormat} />
                    <Input id="tFormat" label="Trip Dispatch Format ID" defaultValue={initialFleetSettings.tripNumberFormat} />
                    <Input id="dFormat" label="Driver Roster Format ID" defaultValue={initialFleetSettings.driverIdFormat} />
                    <Input id="remDays" label="Maintenance Reminder (Days)" type="number" defaultValue={initialFleetSettings.maintenanceReminderDays} />
                    <Input id="alertPct" label="Fuel Tank Alert Threshold (%)" type="number" defaultValue={initialFleetSettings.fuelAlertThreshold} />
                  </div>

                  <div className="flex justify-end mt-6 border-t border-[#2C2C2C] pt-4 font-mono text-[10px]">
                    <Button onClick={() => alert('SYSTEM_FLEET_PREFS_UPDATED // Operations values saved.')} variant="primary" className="h-9">
                      <Save size={12} className="mr-1.5" />
                      <span>Save Preferences</span>
                    </Button>
                  </div>
                </div>

                {/* Notifications Switches */}
                <div className="border border-[#2C2C2C] bg-[#111111] p-6 text-left">
                  <div className="border-b border-[#2C2C2C] pb-3 mb-5 font-mono flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Alerts & Broadcast Notifications</h3>
                    <span className="text-[10px] text-gray-500">Broadcast triggers</span>
                  </div>

                  <div className="flex flex-col gap-4 font-mono text-xs text-gray-300">
                    <div className="flex items-center justify-between p-3 border border-[#2C2C2C]/50 bg-[#0F0F10]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-bold">Email Notifications</span>
                        <span className="text-[9px] text-gray-500">Send system dispatches and reports to corporate email.</span>
                      </div>
                      <input type="checkbox" defaultChecked={initialNotificationSettings.emailNotifications} className="h-4 w-8 bg-zinc-800 checked:bg-[#D97706] rounded-none cursor-pointer appearance-none focus:outline-none" />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-[#2C2C2C]/50 bg-[#0F0F10]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-bold">SMS Notifications</span>
                        <span className="text-[9px] text-gray-500">Send dispatch alerts and emergency breakdowns to driver phones.</span>
                      </div>
                      <input type="checkbox" defaultChecked={initialNotificationSettings.smsNotifications} className="h-4 w-8 bg-zinc-800 checked:bg-[#D97706] rounded-none cursor-pointer appearance-none focus:outline-none" />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-[#2C2C2C]/50 bg-[#0F0F10]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-bold">Push Alerts Notifications</span>
                        <span className="text-[9px] text-gray-500">Enable in-app real-time browser audio notifications.</span>
                      </div>
                      <input type="checkbox" defaultChecked={initialNotificationSettings.pushNotifications} className="h-4 w-8 bg-zinc-800 checked:bg-[#D97706] rounded-none cursor-pointer appearance-none focus:outline-none" />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-[#2C2C2C]/50 bg-[#0F0F10]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-bold">Trip Status Alerts</span>
                        <span className="text-[9px] text-gray-500">Trigger notifications on route delay or border exit alerts.</span>
                      </div>
                      <input type="checkbox" defaultChecked={initialNotificationSettings.tripAlerts} className="h-4 w-8 bg-zinc-800 checked:bg-[#D97706] rounded-none cursor-pointer appearance-none focus:outline-none" />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-[#2C2C2C]/50 bg-[#0F0F10]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-bold">Maintenance Schedules Reminder</span>
                        <span className="text-[9px] text-gray-500">Trigger warnings for upcoming PM tasks.</span>
                      </div>
                      <input type="checkbox" defaultChecked={initialNotificationSettings.maintenanceAlerts} className="h-4 w-8 bg-zinc-800 checked:bg-[#D97706] rounded-none cursor-pointer appearance-none focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SECURITY SETTINGS & AUDIT LOGS */}
            {activeTab === 'security' && (
              <div className="flex flex-col gap-6">
                {/* Security settings */}
                <div className="border border-[#2C2C2C] bg-[#111111] p-6 text-left">
                  <div className="border-b border-[#2C2C2C] pb-3 mb-5 font-mono flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">System Security Policy</h3>
                    <span className="text-[10px] text-gray-500">Access policies</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-mono text-xs">
                    <Select id="pwd" label="Password Complexity Policy" options={[{ value: 'Standard', label: 'Standard (8+ chars)' }, { value: 'Medium', label: 'Medium (Alphanumeric)' }, { value: 'Strict', label: 'Strict (Symbols & Upper)' }]} defaultValue={initialSecuritySettings.passwordPolicy} />
                    <Input id="timeout" label="Session Inactivity Timeout (Minutes)" type="number" defaultValue={initialSecuritySettings.sessionTimeout} />
                    <Input id="limit" label="Maximum Failed Login Attempts" type="number" defaultValue={initialSecuritySettings.loginAttemptLimit} />
                    <div className="flex items-center justify-between p-3 border border-[#2C2C2C]/50 bg-[#0F0F10] sm:col-span-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-bold">Two-Factor Authentication (2FA)</span>
                        <span className="text-[9px] text-gray-500">Enforce OTP code check validation during user login sequence.</span>
                      </div>
                      <input type="checkbox" defaultChecked={initialSecuritySettings.twoFactorAuth} className="h-4 w-8 bg-zinc-800 checked:bg-[#D97706] rounded-none cursor-pointer appearance-none focus:outline-none" />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6 border-t border-[#2C2C2C] pt-4 font-mono text-[10px]">
                    <Button onClick={() => alert('SECURITY_PREFS_COMMITTED // Policy settings saved.')} variant="primary" className="h-9">
                      <Save size={12} className="mr-1.5" />
                      <span>Apply Policies</span>
                    </Button>
                  </div>
                </div>

                {/* Audit Logs */}
                <div className="border border-[#2C2C2C] bg-[#111111] p-4 text-left">
                  <div className="border-b border-[#2C2C2C] pb-3 mb-4 font-mono flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Administrative Audit Logs</h3>
                    <span className="text-[10px] text-gray-500">Records count: {filteredAuditLogs.length}</span>
                  </div>

                  {/* Audit filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4 font-mono text-xs">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-500 pointer-events-none">
                        <Search size={12} />
                      </span>
                      <input
                        type="text"
                        value={auditSearch}
                        onChange={(e) => setAuditSearch(e.target.value)}
                        placeholder="Search logs description..."
                        className="w-full h-8 pl-8 pr-2 bg-[#0F0F10] border border-[#2C2C2C] text-[10px] text-white placeholder-gray-500 focus:outline-none focus:border-[#D97706]"
                      />
                    </div>
                    <select
                      value={auditUser}
                      onChange={(e) => setAuditUser(e.target.value)}
                      className="h-8 w-full bg-[#0F0F10] border border-[#2C2C2C] text-[10px] text-white px-2 focus:outline-none focus:border-[#D97706] cursor-pointer"
                    >
                      <option value="">ALL USERS</option>
                      <option value="Devidutta Mishra">DEVIDUTTA MISHRA</option>
                      <option value="Sarah Jenkins">SARAH JENKINS</option>
                      <option value="David Chen">DAVID CHEN</option>
                      <option value="Marcus Vance">MARCUS VANCE</option>
                      <option value="Elena Rostova">ELENA ROSTOVA</option>
                    </select>
                    <select
                      value={auditModule}
                      onChange={(e) => setAuditModule(e.target.value)}
                      className="h-8 w-full bg-[#0F0F10] border border-[#2C2C2C] text-[10px] text-white px-2 focus:outline-none focus:border-[#D97706] cursor-pointer"
                    >
                      <option value="">ALL MODULES</option>
                      <option value="Authentication">AUTHENTICATION</option>
                      <option value="Vehicles">VEHICLES</option>
                      <option value="Drivers">DRIVERS</option>
                      <option value="Trips">TRIPS</option>
                      <option value="Maintenance">MAINTENANCE</option>
                      <option value="Fuel & Expenses">FUEL & EXPENSES</option>
                      <option value="Reports">REPORTS</option>
                      <option value="Administration">ADMINISTRATION</option>
                    </select>
                    <button
                      onClick={() => {
                        setAuditSearch('');
                        setAuditUser('');
                        setAuditModule('');
                        setAuditAction('');
                      }}
                      className="h-8 px-3 border border-[#2C2C2C] bg-zinc-800 hover:bg-[#1C1C20] text-gray-300 hover:text-white uppercase text-[9px] font-bold rounded-none cursor-pointer flex items-center justify-center"
                    >
                      <RotateCcw size={12} className="mr-1.5" />
                      <span>Clear</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left font-mono text-[10px] border-collapse">
                      <thead>
                        <tr className="text-gray-400 border-b border-[#2C2C2C] uppercase font-bold">
                          <th className="p-2">Timestamp</th>
                          <th className="p-2">User</th>
                          <th className="p-2">Module</th>
                          <th className="p-2">Action</th>
                          <th className="p-2">Description</th>
                          <th className="p-2 text-right">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2C2C2C]/30 text-gray-300">
                        {filteredAuditLogs.map(log => (
                          <tr key={log.logId} className="hover:bg-[#1C1C20] transition-colors">
                            <td className="p-2 whitespace-nowrap text-gray-500">{log.timestamp}</td>
                            <td className="p-2 font-bold whitespace-nowrap text-white">{log.user}</td>
                            <td className="p-2 whitespace-nowrap text-[#D97706]">{log.module.toUpperCase()}</td>
                            <td className="p-2 whitespace-nowrap">
                              <span className={cn(
                                "text-[9px] font-bold px-1 border rounded-none uppercase",
                                log.action === 'SETTINGS_CHANGE' || log.action === 'CREATE' ? 'text-blue-400 border-blue-400/20' : 'text-green-500 border-green-500/20'
                              )}>
                                {log.action}
                              </span>
                            </td>
                            <td className="p-2 max-w-xs truncate" title={log.description}>{log.description}</td>
                            <td className="p-2 text-right text-gray-500 whitespace-nowrap">{log.ipAddress}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: HELP & DOCUMENTATION */}
            {activeTab === 'help' && (
              <div className="border border-[#2C2C2C] bg-[#111111] p-6 text-left">
                <div className="border-b border-[#2C2C2C] pb-3 mb-5 font-mono flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Help Center & Guides</h3>
                  <span className="text-[10px] text-gray-500">Console documentation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-gray-300">
                  <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-4 flex flex-col gap-2 hover:border-[#D97706]/20 transition-colors">
                    <div className="flex items-center gap-2 text-[#D97706] font-bold font-mono text-xs">
                      <FileText size={14} />
                      <span>User Guide Documentation</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-normal">Instructions on administrative logins, session controls, and profile custom settings.</p>
                    <button className="text-[10px] text-[#D97706] font-bold text-left hover:underline cursor-pointer uppercase font-mono mt-1" onClick={() => alert('DOCS_SPOOL_INITIATED // Opening User Guide.')}>Read Guide →</button>
                  </div>

                  <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-4 flex flex-col gap-2 hover:border-[#D97706]/20 transition-colors">
                    <div className="flex items-center gap-2 text-[#D97706] font-bold font-mono text-xs">
                      <FileText size={14} />
                      <span>Vehicle & Fleet Guide</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-normal">Instructions on adding HGV/LCV assets, status checks, and lifecycle parameters.</p>
                    <button className="text-[10px] text-[#D97706] font-bold text-left hover:underline cursor-pointer uppercase font-mono mt-1" onClick={() => alert('DOCS_SPOOL_INITIATED // Opening Fleet Guide.')}>Read Guide →</button>
                  </div>

                  <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-4 flex flex-col gap-2 hover:border-[#D97706]/20 transition-colors">
                    <div className="flex items-center gap-2 text-[#D97706] font-bold font-mono text-xs">
                      <FileText size={14} />
                      <span>Trip & Dispatch operations Guide</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-normal">Instructions on trip dispatching, driver routing, Fastag toll allocations, and status tracking.</p>
                    <button className="text-[10px] text-[#D97706] font-bold text-left hover:underline cursor-pointer uppercase font-mono mt-1" onClick={() => alert('DOCS_SPOOL_INITIATED // Opening Trips Guide.')}>Read Guide →</button>
                  </div>

                  <div className="border border-[#2C2C2C]/50 bg-[#0F0F10] p-4 flex flex-col gap-2 hover:border-[#D97706]/20 transition-colors">
                    <div className="flex items-center gap-2 text-[#D97706] font-bold font-mono text-xs">
                      <FileText size={14} />
                      <span>Maintenance & Repairs Guide</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-normal">Instructions on breakdown reports, preventive scheduler calendars, and mechanic assignments.</p>
                    <button className="text-[10px] text-[#D97706] font-bold text-left hover:underline cursor-pointer uppercase font-mono mt-1" onClick={() => alert('DOCS_SPOOL_INITIATED // Opening Maintenance Guide.')}>Read Guide →</button>
                  </div>
                </div>

                <div className="border border-[#2C2C2C]/60 bg-[#0F0F10] p-4 flex flex-col gap-2 mt-6 rounded-none text-xs text-gray-400 font-sans">
                  <div className="flex items-center gap-2 text-[#D97706] font-bold font-mono text-xs border-b border-[#2C2C2C]/50 pb-1.5 mb-1.5 uppercase">
                    <Info size={14} />
                    <span>System support desk contacts</span>
                  </div>
                  <p>For system discrepancies, database locks, or Fastag API faults, reach our 24/7 internal control line:</p>
                  <p className="font-mono text-white text-[11px] font-bold">HOTLINE: +91 22 9900 8800 // EMAIL: systems-support@transitops.com</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
