import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Unauthorized } from '../pages/Unauthorized';
import { NotFound } from '../pages/NotFound';
import { Dashboard } from '../pages/Dashboard';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

const VehicleRegistry = React.lazy(() => import('../pages/VehicleRegistry').then(m => ({ default: m.VehicleRegistry })));
const DriverManagement = React.lazy(() => import('../pages/DriverManagement').then(m => ({ default: m.DriverManagement })));
const TripManagement = React.lazy(() => import('../pages/TripManagement').then(m => ({ default: m.TripManagement })));
const MaintenanceManagement = React.lazy(() => import('../pages/MaintenanceManagement').then(m => ({ default: m.MaintenanceManagement })));
const FuelExpenseManagement = React.lazy(() => import('../pages/FuelExpenseManagement').then(m => ({ default: m.FuelExpenseManagement })));
const ReportsAnalytics = React.lazy(() => import('../pages/ReportsAnalytics').then(m => ({ default: m.ReportsAnalytics })));
const AdministrationSettings = React.lazy(() => import('../pages/AdministrationSettings').then(m => ({ default: m.AdministrationSettings })));
const UserProfile = React.lazy(() => import('../pages/UserProfile').then(m => ({ default: m.UserProfile })));

const RouteSuspense: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense
    fallback={
      <div className="flex flex-col items-center justify-center h-full w-full py-24 font-mono select-none">
        <div className="w-8 h-8 border-2 border-[#2C2C2C] border-t-[#D97706] animate-spin mb-3" />
        <span className="text-[10px] uppercase tracking-widest text-[#8E8E93]">Loading Module...</span>
      </div>
    }
  >
    {children}
  </Suspense>
);

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F10] text-white flex flex-col items-center justify-center font-mono">
        <div className="w-10 h-10 border-2 border-[#2C2C2C] border-t-[#D97706] animate-spin mb-4" />
        <span className="text-[10px] uppercase tracking-widest text-[#8E8E93]">Initializing System...</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } 
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route 
          index 
          element={
            <ProtectedRoute permission="view:dashboard">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="fleet" 
          element={
            <ProtectedRoute permission="view:fleet">
              <RouteSuspense><VehicleRegistry /></RouteSuspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="drivers" 
          element={
            <ProtectedRoute permission="view:drivers">
              <RouteSuspense><DriverManagement /></RouteSuspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="trips" 
          element={
            <ProtectedRoute permission="view:trips">
              <RouteSuspense><TripManagement /></RouteSuspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="maintenance" 
          element={
            <ProtectedRoute permission="view:maintenance">
              <RouteSuspense><MaintenanceManagement /></RouteSuspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="fuel" 
          element={
            <ProtectedRoute permission="view:fuel">
              <RouteSuspense><FuelExpenseManagement /></RouteSuspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="analytics" 
          element={
            <ProtectedRoute permission="view:analytics">
              <RouteSuspense><ReportsAnalytics /></RouteSuspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="settings" 
          element={
            <ProtectedRoute permission="view:settings">
              <RouteSuspense><AdministrationSettings /></RouteSuspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="profile" 
          element={
            <ProtectedRoute permission="view:dashboard">
              <RouteSuspense><UserProfile /></RouteSuspense>
            </ProtectedRoute>
          } 
        />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
