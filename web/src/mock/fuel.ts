export type FuelType = 'Diesel' | 'Petrol' | 'CNG' | 'Biofuel';
export type FuelPaymentMethod = 'Fuel Card' | 'Cash' | 'Corporate Card' | 'UPI';

export interface FuelLog {
  logId: string;
  vehicleReg: string;
  driverId: string;
  fuelType: FuelType;
  quantity: number; // in Litres
  pricePerLitre: number; // in INR
  totalCost: number; // auto-calculated: quantity * pricePerLitre
  currentOdometer: number; // in km
  mileageSinceLastFill: number; // in km
  fuelEfficiency: number; // in km/L
  fuelStation: string;
  paymentMethod: FuelPaymentMethod;
  receiptNumber: string;
  fuelDate: string; // YYYY-MM-DD
  remarks: string;
}

export const mockFuelLogs: FuelLog[] = [
  {
    logId: 'FLG-2026-0001',
    vehicleReg: 'MH-12-PQ-4567',
    driverId: 'DRV-2021-0941',
    fuelType: 'Diesel',
    quantity: 80,
    pricePerLitre: 94.5,
    totalCost: 7560,
    currentOdometer: 48620,
    mileageSinceLastFill: 420,
    fuelEfficiency: 5.25,
    fuelStation: 'HP Auto Care, Pune',
    paymentMethod: 'Fuel Card',
    receiptNumber: 'HP-90823',
    fuelDate: '2026-07-12',
    remarks: 'Routine transit top-up. Fuel tank filled to maximum.',
  },
  {
    logId: 'FLG-2026-0002',
    vehicleReg: 'KA-03-MX-1234',
    driverId: 'DRV-2020-0382',
    fuelType: 'Diesel',
    quantity: 120,
    pricePerLitre: 96.2,
    totalCost: 11544,
    currentOdometer: 104500,
    mileageSinceLastFill: 540,
    fuelEfficiency: 4.5,
    fuelStation: 'Indian Oil, Hosur',
    paymentMethod: 'Corporate Card',
    receiptNumber: 'IOC-11204',
    fuelDate: '2026-07-11',
    remarks: 'Consignment routing refueling. No engine irregularities reported.',
  },
  {
    logId: 'FLG-2026-0003',
    vehicleReg: 'DL-3C-EF-5566',
    driverId: 'DRV-2022-0520',
    fuelType: 'Petrol',
    quantity: 45,
    pricePerLitre: 95.8,
    totalCost: 4311,
    currentOdometer: 25410,
    mileageSinceLastFill: 360,
    fuelEfficiency: 8.0,
    fuelStation: 'Bharat Petroleum, Delhi',
    paymentMethod: 'Cash',
    receiptNumber: 'BP-33421',
    fuelDate: '2026-07-10',
    remarks: 'Supervisor routine inspection refueling.',
  },
  {
    logId: 'FLG-2026-0004',
    vehicleReg: 'MH-04-QR-3311',
    driverId: 'DRV-2022-0711',
    fuelType: 'Diesel',
    quantity: 95,
    pricePerLitre: 94.8,
    totalCost: 9006,
    currentOdometer: 82400,
    mileageSinceLastFill: 475,
    fuelEfficiency: 5.0,
    fuelStation: 'Shell Outlet, Panvel',
    paymentMethod: 'UPI',
    receiptNumber: 'SH-87612',
    fuelDate: '2026-07-09',
    remarks: 'Reefer truck tank filled before long haul route to Goa.',
  },
  {
    logId: 'FLG-2026-0005',
    vehicleReg: 'MH-12-PQ-4567',
    driverId: 'DRV-2021-0941',
    fuelType: 'Diesel',
    quantity: 75,
    pricePerLitre: 94.2,
    totalCost: 7065,
    currentOdometer: 48200,
    mileageSinceLastFill: 390,
    fuelEfficiency: 5.2,
    fuelStation: 'HP Auto Care, Pune',
    paymentMethod: 'Fuel Card',
    receiptNumber: 'HP-89712',
    fuelDate: '2026-07-05',
    remarks: 'Pre-trip refueling check.',
  },
  {
    logId: 'FLG-2026-0006',
    vehicleReg: 'KA-03-MX-1234',
    driverId: 'DRV-2020-0382',
    fuelType: 'Diesel',
    quantity: 110,
    pricePerLitre: 95.9,
    totalCost: 10549,
    currentOdometer: 103960,
    mileageSinceLastFill: 510,
    fuelEfficiency: 4.64,
    fuelStation: 'Indian Oil, Hosur',
    paymentMethod: 'Corporate Card',
    receiptNumber: 'IOC-10924',
    fuelDate: '2026-07-04',
    remarks: 'refuel log.',
  },
  {
    logId: 'FLG-2026-0007',
    vehicleReg: 'DL-1C-AB-9876',
    driverId: 'DRV-2022-1204',
    fuelType: 'CNG',
    quantity: 50,
    pricePerLitre: 82.5,
    totalCost: 4125,
    currentOdometer: 61250,
    mileageSinceLastFill: 450,
    fuelEfficiency: 9.0,
    fuelStation: 'IGL Station, Gurgaon',
    paymentMethod: 'UPI',
    receiptNumber: 'IGL-98124',
    fuelDate: '2026-07-08',
    remarks: 'Eco-cargo delivery vehicle refuel.',
  },
];
