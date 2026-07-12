export interface VehicleRank {
  rank: number;
  vehicleReg: string;
  tripsCompleted: number;
  revenueGenerated: number;
  fuelEfficiency: number; // km/L
  maintenanceCost: number; // INR
  performanceScore: number; // out of 100
}

export interface DriverRank {
  rank: number;
  driverName: string;
  completedTrips: number;
  safetyScore: number; // out of 100
  avgFuelEfficiency: number; // km/L
  onTimeDeliveryRate: number; // percentage
  performanceScore: number; // out of 100
}

export interface DriverCompliance {
  driverName: string;
  licenseStatus: 'Active' | 'Expired' | 'Suspended';
  safetyScore: number;
  violations: number;
  trainingStatus: 'Completed' | 'Pending' | 'Overdue';
  medicalCertificate: 'Valid' | 'Expired' | 'Pending';
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Warning';
}

export interface SavedReport {
  id: string;
  name: string;
  category: 'Operations' | 'Finance' | 'Safety' | 'Maintenance';
  lastGenerated: string;
  fileSize: string;
}

export const mockVehicleRankings: VehicleRank[] = [
  { rank: 1, vehicleReg: 'MH-12-PQ-4567', tripsCompleted: 42, revenueGenerated: 380000, fuelEfficiency: 5.25, maintenanceCost: 7065, performanceScore: 94 },
  { rank: 2, vehicleReg: 'KA-03-MX-1234', tripsCompleted: 38, revenueGenerated: 342000, fuelEfficiency: 4.58, maintenanceCost: 11544, performanceScore: 91 },
  { rank: 3, vehicleReg: 'DL-1C-AB-9876', tripsCompleted: 35, revenueGenerated: 295000, fuelEfficiency: 9.00, maintenanceCost: 19200, performanceScore: 89 },
  { rank: 4, vehicleReg: 'MH-04-QR-3311', tripsCompleted: 31, revenueGenerated: 260000, fuelEfficiency: 5.00, maintenanceCost: 14000, performanceScore: 85 },
  { rank: 5, vehicleReg: 'KA-51-AB-1122', tripsCompleted: 28, revenueGenerated: 220000, fuelEfficiency: 5.10, maintenanceCost: 8400, performanceScore: 82 },
];

export const mockDriverRankings: DriverRank[] = [
  { rank: 1, driverName: 'Mike Smith', completedTrips: 38, safetyScore: 96, avgFuelEfficiency: 4.58, onTimeDeliveryRate: 98, performanceScore: 96 },
  { rank: 2, driverName: 'Alex Mercer', completedTrips: 35, safetyScore: 94, avgFuelEfficiency: 5.25, onTimeDeliveryRate: 97, performanceScore: 94 },
  { rank: 3, driverName: 'Rajesh Kumar', completedTrips: 32, safetyScore: 92, avgFuelEfficiency: 9.00, onTimeDeliveryRate: 95, performanceScore: 92 },
  { rank: 4, driverName: 'John Doe', completedTrips: 29, safetyScore: 88, avgFuelEfficiency: 5.00, onTimeDeliveryRate: 94, performanceScore: 88 },
  { rank: 5, driverName: 'Sarah Jenkins', completedTrips: 25, safetyScore: 90, avgFuelEfficiency: 5.10, onTimeDeliveryRate: 92, performanceScore: 87 },
];

export const mockDriverCompliances: DriverCompliance[] = [
  { driverName: 'Mike Smith', licenseStatus: 'Active', safetyScore: 96, violations: 0, trainingStatus: 'Completed', medicalCertificate: 'Valid', complianceStatus: 'Compliant' },
  { driverName: 'Alex Mercer', licenseStatus: 'Active', safetyScore: 94, violations: 1, trainingStatus: 'Completed', medicalCertificate: 'Valid', complianceStatus: 'Compliant' },
  { driverName: 'Rajesh Kumar', licenseStatus: 'Active', safetyScore: 92, violations: 0, trainingStatus: 'Completed', medicalCertificate: 'Valid', complianceStatus: 'Compliant' },
  { driverName: 'John Doe', licenseStatus: 'Active', safetyScore: 88, violations: 3, trainingStatus: 'Completed', medicalCertificate: 'Expired', complianceStatus: 'Warning' },
  { driverName: 'Sarah Jenkins', licenseStatus: 'Active', safetyScore: 90, violations: 0, trainingStatus: 'Pending', medicalCertificate: 'Valid', complianceStatus: 'Compliant' },
  { driverName: 'Vikram Singh', licenseStatus: 'Expired', safetyScore: 75, violations: 4, trainingStatus: 'Overdue', medicalCertificate: 'Expired', complianceStatus: 'Non-Compliant' },
];

export const mockSavedReports: SavedReport[] = [
  { id: 'RPT-001', name: 'Monthly Fleet Operations Summary', category: 'Operations', lastGenerated: '2026-07-12', fileSize: '2.4 MB' },
  { id: 'RPT-002', name: 'Fuel Consumption & Economy Report', category: 'Finance', lastGenerated: '2026-07-11', fileSize: '1.8 MB' },
  { id: 'RPT-003', name: 'Expense Category & Cost Breakdown', category: 'Finance', lastGenerated: '2026-07-10', fileSize: '3.1 MB' },
  { id: 'RPT-004', name: 'Driver Safety & Performance Audit', category: 'Safety', lastGenerated: '2026-07-08', fileSize: '1.2 MB' },
  { id: 'RPT-005', name: 'Maintenance Schedule & Cost Overview', category: 'Maintenance', lastGenerated: '2026-07-05', fileSize: '2.9 MB' },
  { id: 'RPT-006', name: 'Trip Speed & On-Time Performance Log', category: 'Operations', lastGenerated: '2026-07-01', fileSize: '4.2 MB' },
];

export const mockHeatmapData: number[][] = [
  // Mon
  [2, 1, 0, 0, 1, 3, 5, 8, 12, 14, 15, 12, 10, 11, 13, 14, 16, 12, 8, 6, 5, 4, 3, 2],
  // Tue
  [1, 0, 0, 1, 2, 4, 6, 9, 13, 15, 14, 11, 9, 10, 12, 15, 17, 13, 9, 7, 4, 3, 2, 1],
  // Wed
  [2, 1, 0, 0, 2, 3, 5, 9, 11, 13, 14, 12, 10, 11, 13, 14, 15, 12, 8, 6, 5, 4, 3, 1],
  // Thu
  [1, 0, 0, 1, 1, 4, 6, 8, 12, 14, 13, 11, 9, 10, 11, 14, 16, 11, 9, 7, 5, 3, 2, 2],
  // Fri
  [2, 1, 0, 0, 2, 3, 5, 7, 10, 12, 13, 11, 10, 12, 14, 16, 18, 14, 10, 8, 6, 5, 4, 3],
  // Sat
  [3, 2, 1, 0, 1, 2, 3, 5, 7, 8, 9, 8, 7, 8, 9, 10, 11, 8, 6, 5, 4, 3, 3, 2],
  // Sun
  [1, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 5, 4, 4, 5, 6, 7, 5, 4, 3, 2, 2, 1, 1],
];
