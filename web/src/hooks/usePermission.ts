import { useAuth } from './useAuth';
import type { Permission } from '../types/auth';
import { ROLE_PERMISSIONS } from '../constants/permissions';

export const usePermission = () => {
  const { user, isAuthenticated } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!isAuthenticated || !user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(hasPermission);
  };

  return { hasPermission, hasAnyPermission, role: user?.role || null };
};
