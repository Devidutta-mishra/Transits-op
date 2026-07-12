import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Role } from '../types/auth';
import { mockAuthService } from '../services/mockAuth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, selectedRole: Role) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'transitops_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const restoreSession = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        console.log('[Auth] Restoring session, found stored data:', stored);
        if (stored) {
          const parsed = JSON.parse(stored) as User;
          if (parsed && parsed.id && parsed.role) {
            console.log('[Auth] Successfully restored user:', parsed);
            setUser(parsed);
          } else {
            console.warn('[Auth] Stored user data is invalid:', parsed);
          }
        }
      } catch (e) {
        console.error('[Auth] Error restoring session:', e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string, selectedRole: Role) => {
    setIsLoading(true);
    console.log('[Auth] Attempting login for:', email, 'with role:', selectedRole);
    try {
      const authenticatedUser = await mockAuthService.login(email, password, selectedRole);
      console.log('[Auth] Login API success, returned user:', authenticatedUser);
      setUser(authenticatedUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authenticatedUser));
    } catch (error) {
      console.error('[Auth] Login failed:', error);
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('[Auth] Logging out user');
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
