export type AdminRole = 'Fleet Manager' | 'Dispatcher' | 'Safety Officer' | 'Financial Analyst' | 'Administrator';
export type AdminStatus = 'Active' | 'Inactive';

export interface AdminUser {
  userId: string;
  name: string;
  role: AdminRole;
  department: string;
  email: string;
  phone: string;
  status: AdminStatus;
  lastLogin: string;
}

export const mockUsersList: AdminUser[] = [
  {
    userId: 'USR-2026-0001',
    name: 'Sarah Jenkins',
    role: 'Fleet Manager',
    department: 'Fleet Operations',
    email: 'manager@transitops.com',
    phone: '+91 98765 43210',
    status: 'Active',
    lastLogin: '2026-07-12 11:34:02',
  },
  {
    userId: 'USR-2026-0002',
    name: 'Marcus Vance',
    role: 'Dispatcher',
    department: 'Logistics Control',
    email: 'dispatcher@transitops.com',
    phone: '+91 98765 43211',
    status: 'Active',
    lastLogin: '2026-07-12 10:15:44',
  },
  {
    userId: 'USR-2026-0003',
    name: 'Elena Rostova',
    role: 'Safety Officer',
    department: 'Safety & Compliance',
    email: 'safety@transitops.com',
    phone: '+91 98765 43212',
    status: 'Active',
    lastLogin: '2026-07-12 09:44:11',
  },
  {
    userId: 'USR-2026-0004',
    name: 'David Chen',
    role: 'Financial Analyst',
    department: 'Finance & Accounts',
    email: 'analyst@transitops.com',
    phone: '+91 98765 43213',
    status: 'Active',
    lastLogin: '2026-07-12 11:02:18',
  },
  {
    userId: 'USR-2026-0005',
    name: 'Devidutta Mishra',
    role: 'Administrator',
    department: 'Information Technology',
    email: 'admin@transitops.com',
    phone: '+91 98765 43214',
    status: 'Active',
    lastLogin: '2026-07-12 11:50:54',
  },
  {
    userId: 'USR-2026-0006',
    name: 'John Miller',
    role: 'Dispatcher',
    department: 'Logistics Control',
    email: 'john.miller@transitops.com',
    phone: '+91 98765 43215',
    status: 'Inactive',
    lastLogin: '2026-07-05 14:22:10',
  },
];
