import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import { ROLE_LABELS } from '../constants/permissions';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';
import { 
  Phone, Building, Briefcase, 
  Key, Clock, ChevronRight 
} from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { role } = usePermission();

  const [activeSubTab, setActiveSubTab] = useState<'info' | 'password' | 'logs' | 'tasks'>('info');

  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!user || !role) return null;

  // Static profile details matching the current logged-in user
  const bioText = `Senior operations manager with over 8 years of logistics experience overseeing local regional hub fleets, driver compliance standards, and ledger accounts.`;
  const skillsList = ['Fleet Logistics', 'Operations Auditing', 'Route Optimization', 'Fastag API Integration', 'Safety Audit Standards'];

  const recentLogins = [
    { timestamp: '2026-07-12 11:34:02', ip: '192.168.1.101', device: 'Chrome Browser v120 / Windows 11' },
    { timestamp: '2026-07-12 10:15:44', ip: '192.168.1.105', device: 'Edge Browser v119 / MacOS Sonoma' },
    { timestamp: '2026-07-11 09:12:30', ip: '192.168.1.101', device: 'Chrome Browser v120 / Windows 11' },
  ];

  const assignedTasks = [
    { id: 1, text: 'Review and approve pending fuel log refuels for vehicle MH-12-PQ-4567.', done: false },
    { id: 2, text: 'Verify license compliance files for newly added driver Rajesh Kumar.', done: true },
    { id: 3, text: 'Confirm schedule for quarterly preventive maintenance check of DL-3C-EF-5566.', done: false },
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPassword || !newPassword || !confirmPassword) {
      alert('SECURITY ERROR // Please fill out all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('SECURITY ERROR // New passwords do not match confirmation input.');
      return;
    }
    alert('SECURITY BROADCAST // User password credentials updated successfully.');
    setCurrPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const getInitials = (n: string) => {
    return n.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 text-left select-none font-sans w-full">
      {/* Breadcrumb Header */}
      <div className="border-b border-[#2C2C2C] pb-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono tracking-widest uppercase">
          <span>Dashboard</span>
          <ChevronRight size={10} />
          <span className="text-white">User Profile</span>
        </div>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-white mt-1 leading-none font-mono">
          USER PROFILE
        </h1>
        <p className="text-[11px] text-gray-500 mt-2 font-mono tracking-wide">
          PERSONAL USER ACCOUNT METADATA // READ WRITE MODE
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Avatar Card */}
        <div className="border border-[#2C2C2C] bg-[#111111] p-6 flex flex-col items-center text-center gap-4">
          <div className="w-24 h-24 bg-zinc-800 border-2 border-[#D97706] flex items-center justify-center text-3xl font-mono text-white font-black rounded-none select-none shadow-md">
            {getInitials(user.name)}
          </div>

          <div className="flex flex-col gap-1 items-center">
            <span className="text-base font-bold text-white uppercase">{user.name}</span>
            <span className="text-xs text-gray-400 font-mono">{user.email}</span>
            <div className="mt-2">
              <Badge variant="orange">{ROLE_LABELS[user.role]}</Badge>
            </div>
          </div>

          <div className="w-full border-t border-[#2C2C2C] pt-4 text-left flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center gap-2.5 text-gray-300">
              <Building size={13} className="text-[#D97706]" />
              <span>Department: Operations</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-300">
              <Briefcase size={13} className="text-[#D97706]" />
              <span>Designation: Lead Administrator</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-300">
              <Phone size={13} className="text-[#D97706]" />
              <span className="font-sans">+91 98765 43201</span>
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Interface */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Navigation sub-tabs */}
          <div className="flex border-b border-[#2C2C2C] text-xs font-mono font-bold uppercase">
            <button
              onClick={() => setActiveSubTab('info')}
              className={cn(
                "px-5 py-3 border-b-2 cursor-pointer transition-colors",
                activeSubTab === 'info' ? "border-[#D97706] text-white bg-[#111111]" : "border-transparent text-gray-500 hover:text-white"
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSubTab('password')}
              className={cn(
                "px-5 py-3 border-b-2 cursor-pointer transition-colors",
                activeSubTab === 'password' ? "border-[#D97706] text-white bg-[#111111]" : "border-transparent text-gray-500 hover:text-white"
              )}
            >
              Update Password
            </button>
            <button
              onClick={() => setActiveSubTab('logs')}
              className={cn(
                "px-5 py-3 border-b-2 cursor-pointer transition-colors",
                activeSubTab === 'logs' ? "border-[#D97706] text-white bg-[#111111]" : "border-transparent text-gray-500 hover:text-white"
              )}
            >
              Access Logs
            </button>
            <button
              onClick={() => setActiveSubTab('tasks')}
              className={cn(
                "px-5 py-3 border-b-2 cursor-pointer transition-colors",
                activeSubTab === 'tasks' ? "border-[#D97706] text-white bg-[#111111]" : "border-transparent text-gray-500 hover:text-white"
              )}
            >
              Tasks
            </button>
          </div>

          <div className="border border-[#2C2C2C] bg-[#111111] p-6">
            {/* SUBTAB 1: BIO & SKILLS */}
            {activeSubTab === 'info' && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Biography</span>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">{bioText}</p>
                </div>

                <div className="flex flex-col gap-2 border-t border-[#2C2C2C] pt-4">
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Competencies & Skills</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {skillsList.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 border border-[#2C2C2C] bg-[#0F0F10] text-[9px] text-[#D97706] font-mono uppercase rounded-none"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 2: CHANGE PASSWORD */}
            {activeSubTab === 'password' && (
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                <div className="border-b border-[#2C2C2C] pb-2 mb-2 font-mono text-[10px] text-gray-500 uppercase">
                  <span>Credential update terminal</span>
                </div>
                <Input
                  id="curr-pwd"
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password..."
                  value={currPassword}
                  onChange={(e) => setCurrPassword(e.target.value)}
                />
                <Input
                  id="new-pwd"
                  label="New Password"
                  type="password"
                  placeholder="Enter new strict password..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  id="confirm-pwd"
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter new password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="flex justify-end border-t border-[#2C2C2C] pt-3 mt-1">
                  <Button type="submit" variant="primary" className="h-9 font-mono text-[10px] uppercase">
                    <Key size={12} className="mr-1.5" />
                    <span>Apply Credentials</span>
                  </Button>
                </div>
              </form>
            )}

            {/* SUBTAB 3: LOGIN LOGS */}
            {activeSubTab === 'logs' && (
              <div className="flex flex-col gap-4 font-mono text-xs">
                <div className="border-b border-[#2C2C2C] pb-2 font-mono text-[10px] text-gray-500 uppercase">
                  <span>Recent Login History logs</span>
                </div>

                <div className="flex flex-col gap-3">
                  {recentLogins.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-[#2C2C2C]/50 bg-[#0F0F10] flex items-center justify-between text-[10px]"
                    >
                      <div className="flex items-center gap-3">
                        <Clock size={13} className="text-[#D97706]" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-white font-bold">{log.device}</span>
                          <span className="text-gray-500 text-[8px]">{log.timestamp}</span>
                        </div>
                      </div>
                      <span className="text-[#A1A1AA]">{log.ip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 4: ASSIGNED TASKS */}
            {activeSubTab === 'tasks' && (
              <div className="flex flex-col gap-4 font-mono text-xs">
                <div className="border-b border-[#2C2C2C] pb-2 font-mono text-[10px] text-gray-500 uppercase">
                  <span>Assigned Action Tasks checklist</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {assignedTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 border border-[#2C2C2C]/50 bg-[#0F0F10] flex items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={t.done}
                        className="h-3.5 w-3.5 bg-[#0F0F10] border border-[#2C2C2C] rounded-none checked:bg-[#D97706] checked:border-[#D97706] focus:ring-0 focus:outline-none cursor-pointer appearance-none checked:after:content-['✓'] checked:after:text-black checked:after:font-bold checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-[10px]"
                      />
                      <span className={cn(
                        "text-[10px] text-gray-300 font-sans leading-tight",
                        t.done && "line-through text-gray-600"
                      )}>
                        {t.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
