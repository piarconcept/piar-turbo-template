import type {
  AuthSession,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  IAuthRepository,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateUserRoleRequest,
  UpdateUserRoleResponse,
} from '@piar/auth-configuration';
import { AccountEntity } from '@piar/domain-models';

const defaultAccounts: AccountEntity[] = [
  new AccountEntity({
    id: 'user-1',
    accountCode: 'USR-001',
    email: 'demo@piar.com',
    passwordHash: 'password',
    role: 'user',
  }),
  new AccountEntity({
    id: 'admin-1',
    accountCode: 'ADM-001',
    email: 'admin@piar.com',
    passwordHash: 'admin',
    role: 'admin',
  }),
];

/**
 * In-memory auth repository.
 * Replace with a persistent implementation when infra is available.
 */
export class AuthRepository implements IAuthRepository {
  private accounts: AccountEntity[];

  constructor(seedAccounts: AccountEntity[] = defaultAccounts) {
    this.accounts = [...seedAccounts];
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const account = this.findAccountByEmail(payload.email);

    if (!account || account.passwordHash !== payload.password) {
      throw new Error('Invalid credentials');
    }

    return {
      account,
      session: this.createSession(account),
    };
  }

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const existing = this.findAccountByEmail(payload.email);

    if (existing) {
      throw new Error('Email already registered');
    }

    const account = new AccountEntity({
      id: `user-${this.accounts.length + 1}`,
      accountCode: payload.accountCode,
      email: payload.email,
      passwordHash: payload.password,
      role: 'user',
    });

    this.accounts.push(account);

    return { account };
  }

  async forgotPassword(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const account = this.findAccountByEmail(payload.email);

    if (!account) {
      return { success: false, message: 'Email not found' };
    }

    return {
      success: true,
      message: `Password reset email sent to ${payload.email}`,
    };
  }

  async updateUserRole(
    payload: UpdateUserRoleRequest
  ): Promise<UpdateUserRoleResponse> {
    const account = this.findAccountById(payload.userId);

    if (!account) {
      throw new Error('User not found');
    }

    account.role = payload.role;

    return { account };
  }

  private findAccountByEmail(email: string): AccountEntity | undefined {
    return this.accounts.find((account) => account.email === email);
  }

  private findAccountById(userId: string): AccountEntity | undefined {
    return this.accounts.find((account) => account.id === userId);
  }

  private createSession(account: AccountEntity): AuthSession {
    return {
      token: `token-${account.id}`,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
  }
}
