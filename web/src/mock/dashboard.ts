export interface MockTrip {
  id: string;
  vehicle: string;
  driver: string;
  origin: string;
  destination: string;
  status: 'Scheduled' | 'In Transit' | 'Completed' | 'Cancelled';
  departureTime: string;
  eta: string;
}

export interface MockVehicleStatus {
  label: string;
  count: number;
  percentage: number;
  color: string; // Tailwind bg color class
}

export interface MockUtilizationData {
  month: string;
  rate: number;
}

export interface MockActivity {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'danger';
}

export interface MockDashboardData {
  // Operational Cards
  totalVehicles: number;
  activeDrivers: number;
  tripsToday: number;
  scheduledTrips: number;
  vehiclesAvailable: number;
  vehiclesInMaintenance: number;
  
  // Financial Cards
  monthlyRevenue: string;
  fuelCost: string;
  operatingCost: string;
  costPerKm: string;
  
  // Safety Cards
  safetyAlerts: number;
  driverCompliance: string;
  pendingInspections: number;
  activeIncidents: number;
  
  // Widgets Datasets
  trips: MockTrip[];
  vehicleStatus: MockVehicleStatus[];
  utilizationHistory: MockUtilizationData[];
  activities: MockActivity[];
}

export const mockDashboardData: MockDashboardData = {
  totalVehicles: 53,
  activeDrivers: 42,
  tripsToday: 5,
  scheduledTrips: 12,
  vehiclesAvailable: 18,
  vehiclesInMaintenance: 4,
  
  monthlyRevenue: '₹4.8 Lakh',
  fuelCost: '₹97,000',
  operatingCost: '₹1.2 Lakh',
  costPerKm: '₹14.50',
  
  safetyAlerts: 2,
  driverCompliance: '98.2%',
  pendingInspections: 6,
  activeIncidents: 0,
  
  trips: [
    {
      id: 'TRP-101',
      vehicle: 'TRK-012',
      driver: 'John Miller',
      origin: 'Mumbai Port',
      destination: 'Pune Hub',
      status: 'In Transit',
      departureTime: '06:30 AM',
      eta: '11:45 AM',
    },
    {
      id: 'TRP-102',
      vehicle: 'TRK-044',
      driver: 'David Jones',
      origin: 'Delhi Terminal',
      destination: 'Jaipur Hub',
      status: 'Scheduled',
      departureTime: '11:00 AM',
      eta: '04:30 PM',
    },
    {
      id: 'TRP-103',
      vehicle: 'TRK-021',
      driver: 'Mike Smith',
      origin: 'Chennai Port',
      destination: 'Bangalore Hub',
      status: 'Completed',
      departureTime: '04:00 AM',
      eta: '09:15 AM',
    },
    {
      id: 'TRP-104',
      vehicle: 'TRK-009',
      driver: 'Robert Garcia',
      origin: 'Kolkata Port',
      destination: 'Patna Terminal',
      status: 'In Transit',
      departureTime: '07:15 AM',
      eta: '02:00 PM',
    },
    {
      id: 'TRP-105',
      vehicle: 'TRK-033',
      driver: 'James Wilson',
      origin: 'Hyderabad WH',
      destination: 'Vijayawada Hub',
      status: 'Cancelled',
      departureTime: '08:00 AM',
      eta: '12:30 PM',
    },
  ],
  
  vehicleStatus: [
    { label: 'Available', count: 18, percentage: 34, color: 'bg-green-600' },
    { label: 'In Trip', count: 24, percentage: 45, color: 'bg-[#D97706]' },
    { label: 'Maintenance', count: 4, percentage: 8, color: 'bg-red-600' },
    { label: 'Idle', count: 7, percentage: 13, color: 'bg-zinc-600' },
  ],
  
  utilizationHistory: [
    { month: 'JAN', rate: 68 },
    { month: 'FEB', rate: 72 },
    { month: 'MAR', rate: 70 },
    { month: 'APR', rate: 75 },
    { month: 'MAY', rate: 78 },
    { month: 'JUN', rate: 80 },
    { month: 'JUL', rate: 82 },
  ],
  
  activities: [
    {
      id: 'act_001',
      message: 'Vehicle TRK-021 completed scheduled trip TRP-103',
      timestamp: '15 mins ago',
      type: 'success',
    },
    {
      id: 'act_002',
      message: 'Maintenance request generated for TRK-004 (Brakes)',
      timestamp: '1 hour ago',
      type: 'warning',
    },
    {
      id: 'act_003',
      message: 'Fuel log submitted for TRK-088 (₹8,500 - IOCL)',
      timestamp: '2 hours ago',
      type: 'info',
    },
    {
      id: 'act_004',
      message: 'Driver assigned to Active Trip TRP-104',
      timestamp: '3 hours ago',
      type: 'info',
    },
    {
      id: 'act_005',
      message: 'Trip TRP-105 delayed due to weather alert (Heavy Rain)',
      timestamp: '4 hours ago',
      type: 'danger',
    },
  ],
};
