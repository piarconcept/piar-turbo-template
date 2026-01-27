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
import {
  AccountEntity,
  InvalidCredentialsError,
  ResourceAlreadyExistsError,
  NotFoundError,
  AccountPort,
} from '@piar/domain-models';
import { JwtTokenService } from '@piar/infra-backend-common-security';

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

export class AuthRepository implements IAuthRepository {
  private accounts: AccountEntity[] = defaultAccounts;

  constructor(
    private readonly accountPort: AccountPort,
    private readonly tokenService: JwtTokenService,
  ) {}

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const account = await this.accountPort.getByEmail(payload.email);

    if (!account || account.passwordHash !== payload.password) {
      throw new InvalidCredentialsError(
        'Invalid email or password',
        undefined,
        'invalid_credentials',
      );
    }
    const accountEntity = new AccountEntity(account);
    return {
      account: accountEntity,
      session: this.createSession(accountEntity),
    };
  }

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const existing = await this.accountPort.getByEmail(payload.email);

    if (existing) {
      throw new ResourceAlreadyExistsError('Email', payload.email, 'email_exists');
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
    const account = await this.accountPort.getByEmail(payload.email);

    if (!account) {
      return { success: false, message: 'Email not found' };
    }

    return {
      success: true,
      message: `Password reset email sent to ${payload.email}`,
    };
  }

  async updateUserRole(payload: UpdateUserRoleRequest): Promise<UpdateUserRoleResponse> {
    const account = await this.accountPort.getById(payload.userId);

    if (!account) {
      throw new NotFoundError('User', payload.userId, 'user_not_found');
    }

    account.role = payload.role;

    return { account: new AccountEntity(account) };
  }

  private createSession(account: AccountEntity): AuthSession {
    return {
      token: this.tokenService.sign({
        accountId: account.id,
        email: account.email,
        role: account.role,
      }),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
  }
}
