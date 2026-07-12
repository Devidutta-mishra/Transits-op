export type Role = 'FLEET_MANAGER' | 'DISPATCHER' | 'SAFETY_OFFICER' | 'FINANCIAL_ANALYST';

export type Permission = 
  | 'view:dashboard'
  | 'view:fleet'
  | 'view:drivers'
  | 'view:trips'
  | 'view:maintenance'
  | 'view:fuel'
  | 'view:analytics'
  | 'view:settings';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
