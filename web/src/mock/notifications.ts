export type NotificationCategory = 'Trip' | 'Maintenance' | 'Fuel' | 'Expense' | 'Driver' | 'Vehicle';

export interface GlobalNotification {
  id: string;
  message: string;
  timestamp: string; // Relative or timestamp string
  unread: boolean;
  category: NotificationCategory;
}

export const mockNotifications: GlobalNotification[] = [
  {
    id: 'NOT-001',
    message: 'New Trip TRP-2026-0001 (Mumbai to Pune) has been successfully dispatched.',
    timestamp: '10 minutes ago',
    unread: true,
    category: 'Trip',
  },
  {
    id: 'NOT-002',
    message: 'Preventive service coolant flush is due for vehicle DL-3C-EF-5566.',
    timestamp: '1 hour ago',
    unread: true,
    category: 'Maintenance',
  },
  {
    id: 'NOT-003',
    message: 'Fuel fill-up log FLG-2026-0001 (80L) logged for vehicle MH-12-PQ-4567.',
    timestamp: '2 hours ago',
    unread: true,
    category: 'Fuel',
  },
  {
    id: 'NOT-004',
    message: 'Brake pads replacement expense invoice (₹8,400) has been approved by David Chen.',
    timestamp: '3 hours ago',
    unread: false,
    category: 'Expense',
  },
  {
    id: 'NOT-005',
    message: 'Driver Vikram Singh has been flagged Non-Compliant due to license expiration.',
    timestamp: '5 hours ago',
    unread: false,
    category: 'Driver',
  },
  {
    id: 'NOT-006',
    message: 'Vehicle DL-3C-EF-5566 is available after maintenance completion.',
    timestamp: '1 day ago',
    unread: false,
    category: 'Vehicle',
  },
];
