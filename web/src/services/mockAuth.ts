import type { User, Role } from '../types/auth';

const DEMO_USERS: Record<string, { user: User; passwordHash: string }> = {
  'manager@transitops.com': {
    user: {
      id: 'usr_001',
      email: 'manager@transitops.com',
      name: 'Sarah Jenkins',
      role: 'FLEET_MANAGER',
    },
    passwordHash: 'Manager123!',
  },
  'dispatcher@transitops.com': {
    user: {
      id: 'usr_002',
      email: 'dispatcher@transitops.com',
      name: 'Marcus Vance',
      role: 'DISPATCHER',
    },
    passwordHash: 'Dispatcher123!',
  },
  'safety@transitops.com': {
    user: {
      id: 'usr_003',
      email: 'safety@transitops.com',
      name: 'Elena Rostova',
      role: 'SAFETY_OFFICER',
    },
    passwordHash: 'Safety123!',
  },
  'analyst@transitops.com': {
    user: {
      id: 'usr_004',
      email: 'analyst@transitops.com',
      name: 'David Chen',
      role: 'FINANCIAL_ANALYST',
    },
    passwordHash: 'Analyst123!',
  },
};

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export const mockAuthService = {
  login: async (email: string, password: string, selectedRole: Role): Promise<User> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const normalizedEmail = email.toLowerCase().trim();
    const account = DEMO_USERS[normalizedEmail];

    if (!account) {
      throw new AuthenticationError('Invalid email or password.');
    }

    if (account.passwordHash !== password) {
      throw new AuthenticationError('Invalid email or password.');
    }

    if (account.user.role !== selectedRole) {
      throw new AuthenticationError(
        `Selected role does not match the account's assigned role.`
      );
    }

    return account.user;
  },
};
