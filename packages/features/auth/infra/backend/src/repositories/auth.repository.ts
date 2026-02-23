import type {
  AuthSession,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  IAuthRepository,
  LoginRequest,
  LoginResponse,
  RefreshSessionRequest,
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

const DEFAULT_ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';
const DEFAULT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? '30d';

const EXPIRY_REGEX = /^(\d+)(s|m|h|d)$/i;

function resolveExpiryMs(expiresIn: string | number, fallbackMs: number): number {
  if (typeof expiresIn === 'number' && Number.isFinite(expiresIn)) {
    return expiresIn * 1000;
  }

  if (typeof expiresIn === 'string') {
    const match = expiresIn.trim().match(EXPIRY_REGEX);
    if (match) {
      const value = Number(match[1]);
      const unit = match[2].toLowerCase();
      if (!Number.isFinite(value)) return fallbackMs;
      const unitMs =
        unit === 's'
          ? 1000
          : unit === 'm'
            ? 60 * 1000
            : unit === 'h'
              ? 60 * 60 * 1000
              : 24 * 60 * 60 * 1000;
      return value * unitMs;
    }
  }

  return fallbackMs;
}

export class AuthRepository implements IAuthRepository {
  constructor(
    private readonly accountPort: AccountPort,
    private readonly tokenService: JwtTokenService,
  ) {}

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const account = await this.accountPort.getByEmail(payload.email);

    if (!account) {
      throw new InvalidCredentialsError(
        'Invalid email or password',
        undefined,
        'invalid_credentials',
      );
    }

    const passwordMatches = await this.accountPort.comparePassword(payload.email, payload.password);
    if (!passwordMatches) {
      throw new InvalidCredentialsError(
        'Invalid email or password',
        undefined,
        'invalid_credentials',
      );
    }
    const accountEntity = new AccountEntity(account);
    accountEntity.passwordHash = undefined;
    return {
      account: accountEntity,
      session: this.createSession(accountEntity, payload.rememberMe),
    };
  }

  async refresh(payload: RefreshSessionRequest): Promise<AuthSession> {
    const refreshToken = payload.refreshToken?.trim();
    if (!refreshToken) {
      throw new InvalidCredentialsError(
        'Invalid refresh token',
        undefined,
        'invalid_refresh_token',
      );
    }

    let decoded: Awaited<ReturnType<JwtTokenService['verify']>>;
    try {
      decoded = await this.tokenService.verify(refreshToken);
    } catch {
      throw new InvalidCredentialsError(
        'Invalid refresh token',
        undefined,
        'invalid_refresh_token',
      );
    }
    if (decoded?.tokenType && decoded.tokenType !== 'refresh') {
      throw new InvalidCredentialsError(
        'Invalid refresh token',
        undefined,
        'invalid_refresh_token',
      );
    }

    const account = await this.accountPort.getById(decoded.accountId);
    if (!account) {
      throw new NotFoundError('User', decoded.accountId, 'user_not_found');
    }

    const accountEntity = new AccountEntity(account);
    accountEntity.passwordHash = undefined;

    return this.createSession(accountEntity, true);
  }

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const existing = await this.accountPort.getByEmail(payload.email);

    if (existing) {
      throw new ResourceAlreadyExistsError('Email', payload.email, 'email_exists');
    }

    const existingCode = await this.accountPort.getByAccountCode(payload.accountCode);
    if (existingCode) {
      throw new ResourceAlreadyExistsError(
        'Account code',
        payload.accountCode,
        'account_code_exists',
      );
    }

    const created = await this.accountPort.create({
      id: '',
      accountCode: payload.accountCode,
      email: payload.email,
      passwordHash: payload.password,
      role: 'user',
    });

    const accountEntity = new AccountEntity(created);
    accountEntity.passwordHash = undefined;
    return { account: accountEntity };
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
    const updated = await this.accountPort.update(account);

    return { account: new AccountEntity(updated) };
  }

  private createSession(account: AccountEntity, rememberMe = false): AuthSession {
    const accessExpiresMs = resolveExpiryMs(DEFAULT_ACCESS_EXPIRES_IN, 60 * 60 * 1000);
    const accessExpiresAt = new Date(Date.now() + accessExpiresMs).toISOString();
    return {
      token: this.tokenService.sign(
        {
          accountId: account.id,
          email: account.email,
          role: account.role,
          tokenType: 'access',
        },
        { expiresIn: DEFAULT_ACCESS_EXPIRES_IN },
      ),
      expiresAt: accessExpiresAt,
      ...(rememberMe ? this.createRefreshSessionPayload(account) : {}),
    };
  }

  private createRefreshSessionPayload(
    account: AccountEntity,
  ): Pick<AuthSession, 'refreshToken' | 'refreshExpiresAt'> {
    const refreshExpiresMs = resolveExpiryMs(DEFAULT_REFRESH_EXPIRES_IN, 30 * 24 * 60 * 60 * 1000);
    const refreshExpiresAt = new Date(Date.now() + refreshExpiresMs).toISOString();
    const refreshToken = this.tokenService.sign(
      {
        accountId: account.id,
        email: account.email,
        role: account.role,
        tokenType: 'refresh',
      },
      { expiresIn: DEFAULT_REFRESH_EXPIRES_IN },
    );

    return { refreshToken, refreshExpiresAt };
  }
}
