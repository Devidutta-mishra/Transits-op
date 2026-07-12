import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F0F10] text-white">
      <Topbar />
      <Sidebar />
      <main className="pl-60 pt-14 min-h-screen">
        <div className="p-6 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
