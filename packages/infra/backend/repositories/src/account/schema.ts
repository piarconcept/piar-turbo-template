/**
 * Account MockData
 * This will be replaced with actual database schema (Prisma, TypeORM, etc.)
 */

export interface AccountMockData {
  id: string;
  accountCode: string;
  email?: string;
  passwordHash?: string;
  role?: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

/**
 * In-memory mock database
 * Replace this with actual database connection
 */
export const mockAccounts: AccountMockData[] = [
  {
    id: '1',
    accountCode: 'ACC-001',
    email: 'admin@piar.com',
    passwordHash: '$2b$10$XQq.jVZ5Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4', // password: admin123
    role: 'admin',
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: '2',
    accountCode: 'ACC-002',
    email: 'user@piar.com',
    passwordHash: '$2b$10$YRr.kVZ5Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4Z4', // password: user123
    role: 'user',
    createdAt: new Date('2025-01-02').toISOString(),
    updatedAt: new Date('2025-01-02').toISOString(),
  },
];
