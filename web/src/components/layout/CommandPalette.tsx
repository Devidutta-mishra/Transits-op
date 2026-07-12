import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockVehiclesData } from '../../mock/vehicles';
import { mockDriversData } from '../../mock/drivers';
import { mockTripsData } from '../../mock/trips';
import { 
  Search, Terminal, Truck, Users, Calendar, 
  Settings, User, FileText, Wrench, ShieldAlert 
} from 'lucide-react';

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Pages' | 'Vehicles' | 'Drivers' | 'Trips';
  path: string;
  icon: any;
}

export const CommandPalette: React.FC = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: PaletteItem[] = React.useMemo(() => {
    const pagesList: PaletteItem[] = [
      { id: 'p1', title: 'Dashboard Analytics', subtitle: 'Overview metrics & logs', category: 'Pages', path: '/', icon: Terminal },
      { id: 'p2', title: 'Vehicle Registry', subtitle: 'Asset list & statuses', category: 'Pages', path: '/fleet', icon: Truck },
      { id: 'p3', title: 'Driver Management', subtitle: 'Compliance roster & scoring', category: 'Pages', path: '/drivers', icon: Users },
      { id: 'p4', title: 'Trip Dispatch Center', subtitle: 'Route scheduler & manifests', category: 'Pages', path: '/trips', icon: Calendar },
      { id: 'p5', title: 'Maintenance Management', subtitle: 'Service orders & schedules', category: 'Pages', path: '/maintenance', icon: Wrench },
      { id: 'p6', title: 'Fuel & Expense Ledger', subtitle: 'Logs & approve audits', category: 'Pages', path: '/fuel', icon: ShieldAlert },
      { id: 'p7', title: 'Reports & Analytics', subtitle: 'BI dashboards & summaries', category: 'Pages', path: '/analytics', icon: FileText },
      { id: 'p8', title: 'Administration Settings', subtitle: 'Permissions & configuration', category: 'Pages', path: '/settings', icon: Settings },
      { id: 'p9', title: 'My Profile settings', subtitle: 'Biography & credentials', category: 'Pages', path: '/profile', icon: User },
    ];

    const vehiclesList: PaletteItem[] = mockVehiclesData.map(v => ({
      id: `v-${v.registrationNumber}`,
      title: v.registrationNumber,
      subtitle: `${v.model} // Status: ${v.status}`,
      category: 'Vehicles',
      path: '/fleet',
      icon: Truck,
    }));

    const driversList: PaletteItem[] = mockDriversData.map(d => ({
      id: `d-${d.driverId}`,
      title: d.fullName,
      subtitle: `License: ${d.licenseNumber} // Status: ${d.status}`,
      category: 'Drivers',
      path: '/drivers',
      icon: Users,
    }));

    const tripsList: PaletteItem[] = mockTripsData.map(t => ({
      id: `t-${t.tripId}`,
      title: t.tripId,
      subtitle: `${t.origin} to ${t.destination} // ${t.status}`,
      category: 'Trips',
      path: '/trips',
      icon: Calendar,
    }));

    return [...pagesList, ...vehiclesList, ...driversList, ...tripsList];
  }, []);

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return items.slice(0, 10); // Show first 10 items initially
    const q = query.toLowerCase().trim();
    return items.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.subtitle?.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: PaletteItem) => {
    setIsOpen(false);
    navigate(item.path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-24 px-4 font-mono select-none"
      onClick={() => setIsOpen(false)}
    >
      <div 
        ref={containerRef}
        className="w-full max-w-lg border border-[#2C2C2C] bg-[#111111] shadow-2xl flex flex-col max-h-[420px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 border-b border-[#2C2C2C] px-4 py-3">
          <Search size={14} className="text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="SEARCH PAGES, ASSETS, DRIVERS, TRIPS (ESC TO EXIT)..."
            className="w-full h-7 bg-transparent border-none text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-0 uppercase tracking-wider"
          />
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-6 text-[10px] text-gray-500 uppercase">No matching console items.</div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center justify-between p-2.5 transition-colors text-left cursor-pointer border rounded-none ${
                    idx === selectedIndex 
                      ? 'bg-[#1C1C20] border-[#D97706] text-white' 
                      : 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-[#1C1C20]/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon size={14} className={idx === selectedIndex ? 'text-[#D97706]' : 'text-gray-500'} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold uppercase truncate">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-[8px] text-gray-500 uppercase mt-0.5 truncate">{item.subtitle}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[8px] uppercase px-1.5 py-0.5 border border-[#2C2C2C] bg-[#0F0F10] text-gray-500 font-bold shrink-0">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info panel */}
        <div className="border-t border-[#2C2C2C] px-3 py-2 flex items-center justify-between text-[8px] text-gray-500 uppercase font-bold bg-[#0F0F10]">
          <div className="flex gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
