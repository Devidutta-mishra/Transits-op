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
        if (stored) {
          const parsed = JSON.parse(stored) as User;
          if (parsed && parsed.id && parsed.role) {
            setUser(parsed);
          }
        }
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string, selectedRole: Role) => {
    setIsLoading(true);
    try {
      const authenticatedUser = await mockAuthService.login(email, password, selectedRole);
      setUser(authenticatedUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authenticatedUser));
    } catch (error) {
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
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
