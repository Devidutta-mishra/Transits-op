export type ExpenseCategory = 
  | 'Fuel' 
  | 'Repair' 
  | 'Maintenance' 
  | 'Insurance' 
  | 'Toll' 
  | 'Parking' 
  | 'Tyres' 
  | 'Registration' 
  | 'Driver Allowance' 
  | 'Miscellaneous';

export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected' | 'Paid';
export type ExpensePaymentMethod = 'Corporate Card' | 'Cash' | 'Bank Transfer' | 'UPI';

export interface ExpenseRecord {
  expenseId: string;
  vehicleReg: string;
  category: ExpenseCategory;
  description: string;
  amount: number; // in INR
  paymentMethod: ExpensePaymentMethod;
  approvedBy: string; // Authorizer name
  status: ExpenseStatus;
  expenseDate: string; // YYYY-MM-DD
  invoiceNumber: string;
  remarks: string;
  archived?: boolean;
}

export const mockExpenses: ExpenseRecord[] = [
  {
    expenseId: 'EXP-2026-0001',
    vehicleReg: 'MH-12-PQ-4567',
    category: 'Toll',
    description: 'Mumbai-Pune Expressway toll charge charges. Auto-debit fastag log.',
    amount: 650,
    paymentMethod: 'UPI',
    approvedBy: 'Devidutta Mishra',
    status: 'Paid',
    expenseDate: '2026-07-12',
    invoiceNumber: 'FTG-982143',
    remarks: 'Fastag account debited automatically.',
    archived: false,
  },
  {
    expenseId: 'EXP-2026-0002',
    vehicleReg: 'KA-51-AB-1122',
    category: 'Maintenance',
    description: 'Brake pads inspection and replacement service charge at workshop.',
    amount: 8400,
    paymentMethod: 'Bank Transfer',
    approvedBy: 'Devidutta Mishra',
    status: 'Approved',
    expenseDate: '2026-07-12',
    invoiceNumber: 'WKS-88210',
    remarks: 'Invoiced from George Cooper service station. Awaiting bank clearance.',
    archived: false,
  },
  {
    expenseId: 'EXP-2026-0003',
    vehicleReg: 'DL-3C-EF-5566',
    category: 'Insurance',
    description: 'Annual comprehensive commercial vehicle third-party insurance renewal premium fee.',
    amount: 32000,
    paymentMethod: 'Corporate Card',
    approvedBy: 'Amit Sharma',
    status: 'Paid',
    expenseDate: '2026-07-10',
    invoiceNumber: 'INS-441209',
    remarks: 'ICICI Lombard insurance package premium. Policy certificate locked.',
    archived: false,
  },
  {
    expenseId: 'EXP-2026-0004',
    vehicleReg: 'KA-03-MX-1234',
    category: 'Driver Allowance',
    description: 'Outstation night halt and food allowance for driver Mike Smith.',
    amount: 1500,
    paymentMethod: 'Cash',
    approvedBy: 'Karan Singh',
    status: 'Pending',
    expenseDate: '2026-07-11',
    invoiceNumber: 'ALW-11029',
    remarks: 'Dispatcher submission check pending manager audit.',
    archived: false,
  },
  {
    expenseId: 'EXP-2026-0005',
    vehicleReg: 'MH-04-QR-3311',
    category: 'Tyres',
    description: 'Two front tyres retreading and alignment charges.',
    amount: 14000,
    paymentMethod: 'Bank Transfer',
    approvedBy: 'Devidutta Mishra',
    status: 'Approved',
    expenseDate: '2026-07-06',
    invoiceNumber: 'TYR-99823',
    remarks: 'Approved by Fleet Manager.',
    archived: false,
  },
  {
    expenseId: 'EXP-2026-0006',
    vehicleReg: 'DL-1C-AB-9876',
    category: 'Repair',
    description: 'Radiator coolant hose burst breakdown repair on highway.',
    amount: 19200,
    paymentMethod: 'UPI',
    approvedBy: 'Amit Sharma',
    status: 'Paid',
    expenseDate: '2026-07-11',
    invoiceNumber: 'REP-90812',
    remarks: 'Emergency breakdown recovery task expense. Cleared.',
    archived: false,
  },
  {
    expenseId: 'EXP-2026-0007',
    vehicleReg: 'WB-02-KK-3344',
    category: 'Registration',
    description: 'Annual carriage permit extension and fitness certificate fees.',
    amount: 7500,
    paymentMethod: 'Corporate Card',
    approvedBy: 'Devidutta Mishra',
    status: 'Rejected',
    expenseDate: '2026-07-05',
    invoiceNumber: 'REG-88214',
    remarks: 'Rejected: Vehicle is retired from operations and scheduled for scrap auction.',
    archived: false,
  },
  {
    expenseId: 'EXP-2026-0008',
    vehicleReg: 'KA-03-MX-1234',
    category: 'Parking',
    description: 'Consignment yard parking fee.',
    amount: 450,
    paymentMethod: 'Cash',
    approvedBy: 'Karan Singh',
    status: 'Paid',
    expenseDate: '2026-07-09',
    invoiceNumber: 'PRK-88120',
    remarks: 'Routine toll gate yard cash clearance slip.',
    archived: false,
  },
];
