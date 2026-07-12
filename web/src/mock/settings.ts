export interface CompanyProfile {
  companyName: string;
  logoUrl: string;
  companyEmail: string;
  phone: string;
  website: string;
  gstNumber: string;
  headquarters: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  businessHours: string;
  emergencyContact: string;
}

export interface FleetSettings {
  defaultFuelType: 'Diesel' | 'Petrol' | 'CNG' | 'Biofuel';
  distanceUnit: 'km' | 'miles';
  weightUnit: 'kg' | 'lbs' | 'tonnes';
  currency: 'INR' | 'USD' | 'EUR';
  timeZone: string;
  defaultLanguage: string;
  vehicleNumberFormat: string;
  tripNumberFormat: string;
  driverIdFormat: string;
  maintenanceReminderDays: number;
  fuelAlertThreshold: number; // in percentage
}

export interface SecuritySettings {
  passwordPolicy: 'Standard' | 'Medium' | 'Strict';
  sessionTimeout: number; // in minutes
  twoFactorAuth: boolean;
  loginAttemptLimit: number;
  deviceManagementEnabled: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  tripAlerts: boolean;
  maintenanceAlerts: boolean;
  fuelAlerts: boolean;
  expenseApprovalAlerts: boolean;
  driverComplianceAlerts: boolean;
}

export const initialCompanyProfile: CompanyProfile = {
  companyName: 'TransitOps Logistics Private Limited',
  logoUrl: '',
  companyEmail: 'operations@transitops.com',
  phone: '+91 22 8877 6655',
  website: 'https://transitops.logistics.com',
  gstNumber: '27AAAAA1111A1Z1',
  headquarters: 'Hiranandani Business Park, Sector 4',
  address: 'Building 3, 5th Floor, Powai',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  zipCode: '400076',
  businessHours: '08:00 AM - 08:00 PM (Monday - Saturday)',
  emergencyContact: '+91 99999 88888',
};

export const initialFleetSettings: FleetSettings = {
  defaultFuelType: 'Diesel',
  distanceUnit: 'km',
  weightUnit: 'kg',
  currency: 'INR',
  timeZone: 'Asia/Kolkata (GMT+5:30)',
  defaultLanguage: 'English (India)',
  vehicleNumberFormat: 'XX-00-XX-0000',
  tripNumberFormat: 'TRP-YYYY-0000',
  driverIdFormat: 'DRV-YYYY-0000',
  maintenanceReminderDays: 7,
  fuelAlertThreshold: 15,
};

export const initialSecuritySettings: SecuritySettings = {
  passwordPolicy: 'Strict',
  sessionTimeout: 30,
  twoFactorAuth: false,
  loginAttemptLimit: 5,
  deviceManagementEnabled: true,
};

export const initialNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  tripAlerts: true,
  maintenanceAlerts: true,
  fuelAlerts: false,
  expenseApprovalAlerts: true,
  driverComplianceAlerts: true,
};
