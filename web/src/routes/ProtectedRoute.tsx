import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import type { Permission } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactElement;
  permission?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, permission }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission } = usePermission();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F10] text-white flex flex-col items-center justify-center font-mono">
        <div className="w-10 h-10 border-2 border-[#2C2C2C] border-t-[#D97706] animate-spin mb-4" />
        <span className="text-[10px] uppercase tracking-widest text-[#8E8E93]">Initializing System...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
