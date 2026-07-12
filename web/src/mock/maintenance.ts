export type MaintenanceType = 
  | 'Preventive' 
  | 'Corrective' 
  | 'Breakdown' 
  | 'Inspection' 
  | 'Oil Change' 
  | 'Tyre Replacement' 
  | 'Brake Service';

export type MaintenanceStatus = 
  | 'Scheduled' 
  | 'In Progress' 
  | 'Waiting Parts' 
  | 'Completed' 
  | 'Cancelled' 
  | 'Overdue';

export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface MaintenanceJob {
  jobId: string;
  vehicleReg: string; // Registration Number
  maintenanceType: MaintenanceType;
  priority: MaintenancePriority;
  assignedMechanic: string;
  scheduledDate: string; // YYYY-MM-DD
  completionDate?: string; // YYYY-MM-DD
  estimatedCost: number; // in INR
  actualCost?: number; // in INR
  estimatedDuration: number; // in hours
  description: string;
  requiredParts: string[];
  status: MaintenanceStatus;
  archived?: boolean;
}

export const mockMaintenanceData: MaintenanceJob[] = [
  {
    jobId: 'MNT-2026-0001',
    vehicleReg: 'DL-1C-AB-9876',
    maintenanceType: 'Breakdown',
    priority: 'Critical',
    assignedMechanic: 'Amit Sharma',
    scheduledDate: '2026-07-11',
    estimatedCost: 18500,
    actualCost: 19200,
    estimatedDuration: 6,
    description: 'Sudden engine overheating reported on National Highway 48. Radiator coolant hose split. Requires hose replacement and cooling system flush.',
    requiredParts: ['Radiator Hose', 'Coolant Fluid 5L', 'Hose Clamps'],
    status: 'In Progress',
    archived: false,
  },
  {
    jobId: 'MNT-2026-0002',
    vehicleReg: 'KA-51-AB-1122',
    maintenanceType: 'Brake Service',
    priority: 'High',
    assignedMechanic: 'George Cooper',
    scheduledDate: '2026-07-12',
    estimatedCost: 8400,
    estimatedDuration: 3,
    description: 'Squealing noise reported from front wheels during low-speed deceleration. Inspect brake calipers and replace front brake pads.',
    requiredParts: ['Front Brake Pad Set', 'Brake Cleaner Spray'],
    status: 'Waiting Parts',
    archived: false,
  },
  {
    jobId: 'MNT-2026-0003',
    vehicleReg: 'WB-02-KK-3344',
    maintenanceType: 'Inspection',
    priority: 'Low',
    assignedMechanic: 'Amit Sharma',
    scheduledDate: '2026-07-08',
    completionDate: '2026-07-08',
    estimatedCost: 2500,
    actualCost: 2500,
    estimatedDuration: 2,
    description: 'Routine quarterly fitness inspection of cargo carriage alignment and suspension load bushes.',
    requiredParts: [],
    status: 'Completed',
    archived: false,
  },
  {
    jobId: 'MNT-2026-0004',
    vehicleReg: 'DL-3C-EF-5566',
    maintenanceType: 'Preventive',
    priority: 'Medium',
    assignedMechanic: 'Karan Singh',
    scheduledDate: '2026-07-15',
    estimatedCost: 5000,
    estimatedDuration: 4,
    description: 'Standard 40,000 km general preventive checklist. Engine tune-up, belt tension inspect, cabin air filter replacement, wheel alignment.',
    requiredParts: ['Cabin Filter', 'Alternator Belt'],
    status: 'Scheduled',
    archived: false,
  },
  {
    jobId: 'MNT-2026-0005',
    vehicleReg: 'MH-12-PQ-4567',
    maintenanceType: 'Oil Change',
    priority: 'Low',
    assignedMechanic: 'George Cooper',
    scheduledDate: '2026-07-20',
    estimatedCost: 3200,
    estimatedDuration: 1.5,
    description: 'Scheduled engine oil and filter change. Fluid level check and greasing of steering links.',
    requiredParts: ['Engine Oil 15W40 10L', 'Oil Filter Spin-on'],
    status: 'Scheduled',
    archived: false,
  },
  {
    jobId: 'MNT-2026-0006',
    vehicleReg: 'KA-03-MX-1234',
    maintenanceType: 'Tyre Replacement',
    priority: 'High',
    assignedMechanic: 'Karan Singh',
    scheduledDate: '2026-07-10',
    estimatedCost: 24000,
    estimatedDuration: 2.5,
    description: 'Scheduled replacement of two rear drive-axle tyres due to tread wear approaching safety limit.',
    requiredParts: ['Radial Tyre 295/80R22.5'],
    status: 'Overdue',
    archived: false,
  },
  {
    jobId: 'MNT-2026-0007',
    vehicleReg: 'MH-04-QR-3311',
    maintenanceType: 'Corrective',
    priority: 'Medium',
    assignedMechanic: 'Amit Sharma',
    scheduledDate: '2026-07-05',
    completionDate: '2026-07-06',
    estimatedCost: 12500,
    actualCost: 13100,
    estimatedDuration: 5,
    description: 'Replacement of faulty fuel water separator sensor triggering dashboard warning lamp.',
    requiredParts: ['Water Separator Filter Assembly', 'Sensor Cable'],
    status: 'Completed',
    archived: false,
  },
];

export interface RecentActivityEvent {
  id: string;
  timestamp: string; // ISO String
  eventType: 'Scheduled' | 'Completed' | 'Breakdown' | 'Returned' | 'Parts';
  message: string;
}

export const mockRecentActivities: RecentActivityEvent[] = [
  {
    id: 'ACT-001',
    timestamp: '2026-07-12T10:15:00Z',
    eventType: 'Breakdown',
    message: 'Emergency breakdown reported for DL-1C-AB-9876 in Sector 6. Job MNT-2026-0001 dispatched.',
  },
  {
    id: 'ACT-002',
    timestamp: '2026-07-12T09:30:00Z',
    eventType: 'Returned',
    message: 'Vehicle MH-04-QR-3311 returned to service following water separator repair.',
  },
  {
    id: 'ACT-003',
    timestamp: '2026-07-11T16:00:00Z',
    eventType: 'Completed',
    message: 'Job MNT-2026-0007 marked Completed. Actual cost: ₹13,100.',
  },
  {
    id: 'ACT-004',
    timestamp: '2026-07-11T11:00:00Z',
    eventType: 'Parts',
    message: 'Front brake pads ordered for MNT-2026-0002. Job status: Waiting Parts.',
  },
  {
    id: 'ACT-005',
    timestamp: '2026-07-10T14:00:00Z',
    eventType: 'Scheduled',
    message: 'Preventive service scheduled for DL-3C-EF-5566 on 2026-07-15.',
  },
];
