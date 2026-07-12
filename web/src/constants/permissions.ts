import type { Role, Permission } from '../types/auth';

export const ROLE_LABELS: Record<Role, string> = {
  FLEET_MANAGER: 'Fleet Manager',
  DISPATCHER: 'Dispatcher',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
};

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  FLEET_MANAGER: [
    'view:dashboard',
    'view:fleet',
    'view:drivers',
    'view:trips',
    'view:maintenance',
    'view:fuel',
  ],
  DISPATCHER: [
    'view:dashboard',
    'view:fleet',
    'view:drivers',
    'view:trips',
  ],
  SAFETY_OFFICER: [
    'view:dashboard',
    'view:fleet',
    'view:drivers',
    'view:maintenance',
  ],
  FINANCIAL_ANALYST: [
    'view:dashboard',
    'view:fuel',
    'view:analytics',
    'view:settings',
  ],
};
