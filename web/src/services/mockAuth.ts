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
    try {
      // Bypassing real API calls for UI development
      console.log('Mocking auth login for UI development...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockUser = {
        id: '999',
        email: email || 'demo@transitops.com',
        name: 'Demo User',
        role: selectedRole
      };

      // Store a dummy JWT token
      localStorage.setItem('transitops_token', 'mock_jwt_token_for_ui_testing');

      return mockUser;
    } catch (error: any) {
      throw new AuthenticationError('Mock login failed unexpectedly.');
    }
  },
};
