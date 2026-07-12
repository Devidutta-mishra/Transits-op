export type TripStatus = 'Draft' | 'Scheduled' | 'Dispatched' | 'In Transit' | 'Completed' | 'Cancelled';
export type TripPriority = 'Low' | 'Medium' | 'High';

export interface Trip {
  tripId: string;
  origin: string;
  destination: string;
  assignedVehicle: string; // Registration Number
  assignedDriver: string; // Driver ID
  cargoWeight: number; // in kg
  plannedDistance: number; // in km
  estimatedDuration: number; // in hours
  revenue: number; // in INR
  departureDate: string; // YYYY-MM-DD
  estimatedArrival: string; // YYYY-MM-DD
  status: TripStatus;
  priority: TripPriority;
  notes: string;
  progress: number; // 0 to 100
}

export const mockTripsData: Trip[] = [
  {
    tripId: 'TRP-2026-0001',
    origin: 'Mumbai (West)',
    destination: 'Pune (West)',
    assignedVehicle: 'MH-12-PQ-4567',
    assignedDriver: 'DRV-2021-0941',
    cargoWeight: 18000,
    plannedDistance: 150,
    estimatedDuration: 4,
    revenue: 48000,
    departureDate: '2026-07-12',
    estimatedArrival: '2026-07-12',
    status: 'In Transit',
    priority: 'High',
    notes: 'Urgent cargo dispatch containing pharmaceutical raw materials. Handle with care.',
    progress: 65,
  },
  {
    tripId: 'TRP-2026-0002',
    origin: 'Bengaluru (South)',
    destination: 'Chennai (South)',
    assignedVehicle: 'KA-03-MX-1234',
    assignedDriver: 'DRV-2020-0382',
    cargoWeight: 35000,
    plannedDistance: 350,
    estimatedDuration: 8,
    revenue: 120000,
    departureDate: '2026-07-12',
    estimatedArrival: '2026-07-13',
    status: 'In Transit',
    priority: 'Medium',
    notes: 'Standard automotive components consignment. Delivery deadline set for tomorrow morning.',
    progress: 35,
  },
  {
    tripId: 'TRP-2026-0003',
    origin: 'Mumbai (West)',
    destination: 'Goa (West)',
    assignedVehicle: 'MH-04-QR-3311',
    assignedDriver: 'DRV-2021-0941', // same driver (testing active trip conflict checking)
    cargoWeight: 8000,
    plannedDistance: 600,
    estimatedDuration: 12,
    revenue: 85000,
    departureDate: '2026-07-12',
    estimatedArrival: '2026-07-13',
    status: 'Dispatched',
    priority: 'Low',
    notes: 'Reefer container carrying perishable food items. Verify temperature lock on departure.',
    progress: 10,
  },
  {
    tripId: 'TRP-2026-0004',
    origin: 'Kolkata (East)',
    destination: 'Jamshedpur (East)',
    assignedVehicle: 'WB-02-KK-3344',
    assignedDriver: 'DRV-2022-0711',
    cargoWeight: 2500,
    plannedDistance: 280,
    estimatedDuration: 6,
    revenue: 45000,
    departureDate: '2026-07-10',
    estimatedArrival: '2026-07-10',
    status: 'Completed',
    priority: 'Medium',
    notes: 'Consignment successfully offloaded. No cargo deviations or delay reported.',
    progress: 100,
  },
  {
    tripId: 'TRP-2026-0005',
    origin: 'Delhi (North)',
    destination: 'Jaipur (North)',
    assignedVehicle: 'DL-3C-EF-5566',
    assignedDriver: 'DRV-2022-0520',
    cargoWeight: 15000,
    plannedDistance: 270,
    estimatedDuration: 5,
    revenue: 55000,
    departureDate: '2026-07-11',
    estimatedArrival: '2026-07-11',
    status: 'Cancelled',
    priority: 'High',
    notes: 'Cancelled due to client side scheduling mismatch. Vehicle restored to Delhi yard.',
    progress: 0,
  },
  {
    tripId: 'TRP-2026-0006',
    origin: 'Delhi (North)',
    destination: 'Gurgaon (North)',
    assignedVehicle: 'DL-1C-AB-9876',
    assignedDriver: 'DRV-2022-1204',
    cargoWeight: 3000,
    plannedDistance: 45,
    estimatedDuration: 1.5,
    revenue: 15000,
    departureDate: '2026-07-13',
    estimatedArrival: '2026-07-13',
    status: 'Scheduled',
    priority: 'Medium',
    notes: 'E-commerce parcels container routing. Standard scheduled transit.',
    progress: 0,
  },
  {
    tripId: 'TRP-2026-0007',
    origin: 'Bengaluru (South)',
    destination: 'Mysore (South)',
    assignedVehicle: 'KA-51-AB-1122',
    assignedDriver: 'DRV-2023-0902',
    cargoWeight: 1200,
    plannedDistance: 140,
    estimatedDuration: 3,
    revenue: 22000,
    departureDate: '2026-07-14',
    estimatedArrival: '2026-07-14',
    status: 'Draft',
    priority: 'Low',
    notes: 'LCV delivery draft awaiting cargo packing validation list.',
    progress: 0,
  },
];
