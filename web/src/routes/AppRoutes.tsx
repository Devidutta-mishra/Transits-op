import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Unauthorized } from '../pages/Unauthorized';
import { NotFound } from '../pages/NotFound';
import { Dashboard } from '../pages/Dashboard';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { VehicleRegistry } from '../pages/VehicleRegistry';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

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
              <VehicleRegistry />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="drivers" 
          element={
            <ProtectedRoute permission="view:drivers">
              <PlaceholderPage title="Driver Roster" moduleName="Drivers" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="trips" 
          element={
            <ProtectedRoute permission="view:trips">
              <PlaceholderPage title="Active Trips & Dispatch Console" moduleName="Trips" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="maintenance" 
          element={
            <ProtectedRoute permission="view:maintenance">
              <PlaceholderPage title="Maintenance Logistics" moduleName="Maintenance" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="fuel" 
          element={
            <ProtectedRoute permission="view:fuel">
              <PlaceholderPage title="Fuel & Expense Analytics" moduleName="Fuel & Expenses" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="analytics" 
          element={
            <ProtectedRoute permission="view:analytics">
              <PlaceholderPage title="Operations Performance Analytics" moduleName="Analytics" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="settings" 
          element={
            <ProtectedRoute permission="view:settings">
              <PlaceholderPage title="System Administration Settings" moduleName="Settings" />
            </ProtectedRoute>
          } 
        />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
