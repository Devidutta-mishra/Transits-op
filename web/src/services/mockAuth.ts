import type { User, Role } from '../types/auth';

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

const backendRoleMap: Record<string, Role> = {
  'Admin': 'ADMINISTRATOR',
  'Fleet Manager': 'FLEET_MANAGER',
  'Dispatcher': 'DISPATCHER',
  'Safety Officer': 'SAFETY_OFFICER',
  'Financial Analyst': 'FINANCIAL_ANALYST'
};

export const mockAuthService = {
  login: async (email: string, password: string, selectedRole: Role): Promise<User> => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new AuthenticationError(body.message || 'Invalid credentials or connection error');
      }

      if (!body.success || !body.data || !body.data.user) {
        throw new AuthenticationError('Invalid response format from server');
      }

      const backendUser = body.data.user;
      const backendToken = body.data.token;
      
      const mappedRole = backendRoleMap[backendUser.role] || backendUser.role;

      if (mappedRole !== selectedRole) {
        throw new AuthenticationError(
          `Selected role does not match the account's assigned role.`
        );
      }

      // Store JWT token for subsequent API requests
      if (backendToken) {
        localStorage.setItem('transitops_token', backendToken);
      }

      return {
        id: String(backendUser.id),
        email: backendUser.email,
        name: backendUser.fullName || backendUser.name || 'User',
        role: mappedRole as Role,
      };
    } catch (error: any) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      console.error('API connection error:', error);
      throw new AuthenticationError('Failed to connect to the backend server. Make sure the server is running.');
    }
  },
};
