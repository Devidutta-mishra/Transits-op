import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../ui/Badge';
import { ROLE_LABELS } from '../../constants/permissions';
import { mockVehiclesData } from '../../mock/vehicles';
import { mockDriversData } from '../../mock/drivers';
import { mockTripsData } from '../../mock/trips';
import { mockMaintenanceData } from '../../mock/maintenance';
import { mockFuelLogs } from '../../mock/fuel';
import { mockExpenses } from '../../mock/expenses';
import { mockNotifications } from '../../mock/notifications';
import type { GlobalNotification } from '../../mock/notifications';
import { LogOut, Search, Bell } from 'lucide-react';

export const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<GlobalNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(mockNotifications);

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Perform search queries across mock datastores
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { vehicles: [], drivers: [], trips: [], maintenance: [], fuel: [], expenses: [] };
    const q = searchQuery.toLowerCase().trim();

    return {
      vehicles: mockVehiclesData.filter(v => v.registrationNumber.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)).slice(0, 3),
      drivers: mockDriversData.filter(d => d.fullName.toLowerCase().includes(q) || d.licenseNumber.toLowerCase().includes(q)).slice(0, 3),
      trips: mockTripsData.filter(t => t.tripId.toLowerCase().includes(q) || t.origin.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q)).slice(0, 3),
      maintenance: mockMaintenanceData.filter(m => m.vehicleReg.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)).slice(0, 3),
      fuel: mockFuelLogs.filter(f => f.vehicleReg.toLowerCase().includes(q) || f.fuelType.toLowerCase().includes(q)).slice(0, 3),
      expenses: mockExpenses.filter(e => e.vehicleReg.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)).slice(0, 3),
    };
  }, [searchQuery]);

  const hasSearchResults = Object.values(searchResults).some(arr => arr.length > 0);

  const handleSearchResultClick = (path: string) => {
    setSearchQuery('');
    setShowSearchResults(false);
    navigate(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#111111] border-b border-[#333333] z-30 flex items-center justify-between px-4">
      {/* Brand logo */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white flex items-center justify-center font-mono font-black text-black text-sm select-none">
            T
          </div>
          <span className="font-mono text-sm font-bold uppercase tracking-wider text-white">
            TransitOps
          </span>
        </Link>
      </div>

      {/* Global Search Bar */}
      <div ref={searchRef} className="flex-1 max-w-md mx-8 relative hidden md:block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8E8E93]">
          <Search size={14} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearchResults(true);
          }}
          onFocus={() => setShowSearchResults(true)}
          placeholder="GLOBAL CONSOLE SEARCH (CTRL+K)..."
          className="w-full h-8 pl-9 pr-3 bg-[#000000] border border-[#333333] text-xs font-mono text-white placeholder-[#8E8E93] focus:border-white focus:outline-none focus:ring-1 focus:ring-white rounded-none uppercase tracking-wider"
        />

        {/* Global Search Results Dropdown */}
        {showSearchResults && searchQuery && (
          <div className="absolute top-10 left-0 right-0 border border-[#333333] bg-[#111111] max-h-96 overflow-y-auto z-40 p-3 flex flex-col gap-3 font-mono text-[10px] text-left">
            {!hasSearchResults ? (
              <div className="text-gray-500 uppercase py-2 text-center">No matching console records found.</div>
            ) : (
              <>
                {/* 1. Vehicles */}
                {searchResults.vehicles.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] text-white font-bold uppercase border-b border-[#333333] pb-0.5 mb-1">Vehicles Registry</span>
                    {searchResults.vehicles.map(v => (
                      <button
                        key={v.registrationNumber}
                        onClick={() => handleSearchResultClick('/fleet')}
                        className="flex items-center justify-between text-white hover:text-[#A3A3A3] py-1 text-left w-full cursor-pointer"
                      >
                        <span>{v.registrationNumber} - {v.model.toUpperCase()}</span>
                        <span className="text-[9px] text-gray-500 uppercase">{v.status}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 2. Drivers */}
                {searchResults.drivers.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] text-white font-bold uppercase border-b border-[#333333] pb-0.5 mb-1">Drivers Roster</span>
                    {searchResults.drivers.map(d => (
                      <button
                        key={d.driverId}
                        onClick={() => handleSearchResultClick('/drivers')}
                        className="flex items-center justify-between text-white hover:text-[#A3A3A3] py-1 text-left w-full cursor-pointer"
                      >
                        <span>{d.fullName.toUpperCase()} (ID: {d.driverId})</span>
                        <span className="text-[9px] text-gray-500 uppercase">{d.status}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. Trips */}
                {searchResults.trips.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] text-white font-bold uppercase border-b border-[#333333] pb-0.5 mb-1">Trip Dispatches</span>
                    {searchResults.trips.map(t => (
                      <button
                        key={t.tripId}
                        onClick={() => handleSearchResultClick('/trips')}
                        className="flex items-center justify-between text-white hover:text-[#A3A3A3] py-1 text-left w-full cursor-pointer"
                      >
                        <span>{t.tripId} ({t.origin} → {t.destination})</span>
                        <span className="text-[9px] text-gray-500 uppercase">{t.status}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 4. Maintenance */}
                {searchResults.maintenance.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] text-white font-bold uppercase border-b border-[#333333] pb-0.5 mb-1">Maintenance Logs</span>
                    {searchResults.maintenance.map(m => (
                      <button
                        key={m.jobId}
                        onClick={() => handleSearchResultClick('/maintenance')}
                        className="flex items-center justify-between text-white hover:text-[#A3A3A3] py-1 text-left w-full cursor-pointer"
                      >
                        <span className="truncate max-w-[250px]">{m.vehicleReg} - {m.description.toUpperCase()}</span>
                        <span className="text-[9px] text-gray-500 uppercase">{m.status}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 5. Fuel & Expenses */}
                {(searchResults.fuel.length > 0 || searchResults.expenses.length > 0) && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] text-white font-bold uppercase border-b border-[#333333] pb-0.5 mb-1">Fuel & Expenses Ledger</span>
                    {searchResults.fuel.map(f => (
                      <button
                        key={f.logId}
                        onClick={() => handleSearchResultClick('/fuel')}
                        className="flex items-center justify-between text-white hover:text-[#A3A3A3] py-1 text-left w-full cursor-pointer"
                      >
                        <span>[FUEL] {f.vehicleReg} - {f.quantity}L ({f.fuelType})</span>
                        <span className="text-[9px] text-green-500 font-bold">₹{f.totalCost.toLocaleString()}</span>
                      </button>
                    ))}
                    {searchResults.expenses.map(e => (
                      <button
                        key={e.expenseId}
                        onClick={() => handleSearchResultClick('/fuel')}
                        className="flex items-center justify-between text-white hover:text-[#A3A3A3] py-1 text-left w-full cursor-pointer"
                      >
                        <span>[EXP] {e.vehicleReg} - {e.category.toUpperCase()}</span>
                        <span className="text-[9px] text-red-500 font-bold">₹{e.amount.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* User Actions Panel */}
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown Toggle Bell */}
        <div ref={notificationsRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 bg-[#222222] border border-[#333333] hover:border-white text-[#A3A3A3] hover:text-white transition-colors cursor-pointer rounded-none"
            title="Global Alerts"
          >
            <Bell size={14} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white border border-black flex items-center justify-center text-[8px] font-mono font-bold text-black leading-none">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-9 right-0 w-80 border border-[#333333] bg-[#111111] z-40 p-3 flex flex-col gap-3 font-mono text-[10px] text-left shadow-lg">
              <div className="flex items-center justify-between border-b border-[#333333] pb-2">
                <span className="font-bold text-white uppercase tracking-wider">System Alerts</span>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[8px] text-white hover:underline font-bold uppercase cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-gray-500 uppercase py-4 text-center">No recent alerts.</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-2 border border-[#333333]/50 flex flex-col gap-1 transition-colors ${
                        n.unread ? 'bg-[#222222]/40 border-l-2 border-l-white' : 'bg-[#000000]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[8px] text-gray-500 uppercase">
                        <span>Category: {n.category}</span>
                        <span>{n.timestamp}</span>
                      </div>
                      <p className="text-[9px] text-gray-200 leading-normal font-sans">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account summary */}
        <div className="flex items-center gap-3 border-r border-[#333333] pr-4">
          <div className="text-right flex flex-col justify-center">
            <span className="text-xs font-semibold text-white leading-none">
              {user.name}
            </span>
            <span className="text-[10px] text-[#8E8E93] leading-none mt-1">
              {user.email}
            </span>
          </div>

          <Badge variant="outline">
            {ROLE_LABELS[user.role]}
          </Badge>

          {/* Initials linked to Profile page */}
          <Link
            to="/profile"
            className="w-8 h-8 bg-[#222222] border border-[#A3A3A3]/20 flex items-center justify-center text-xs font-mono text-white font-bold select-none rounded-none hover:border-white hover:text-white transition-colors cursor-pointer"
            title="View User Profile"
          >
            {getInitials(user.name)}
          </Link>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 h-8 px-3 bg-[#222222] border border-[#333333] text-xs font-mono font-bold uppercase tracking-wider text-[#A3A3A3] hover:bg-white hover:text-black hover:border-white active:bg-gray-200 rounded-none cursor-pointer transition-colors"
        >
          <LogOut size={12} />
          <span className="hidden sm:inline">LOGOUT</span>
        </button>
      </div>
    </header>
  );
};
