import {
  IAuthRepository,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  UpdateUserRoleRequest,
  UpdateUserRoleResponse,
  AuthSession,
} from '@piar/auth-configuration';
import { AccountEntity, AccountEntityProps } from '@piar/domain-models';
import { HttpClient } from '@piar/infra-client-common-http';

interface BackendLoginResponse {
  account: AccountEntityProps;
  token: string;
}

interface BackendRegisterResponse {
  account: AccountEntityProps;
}

export class HttpAuthRepository implements IAuthRepository {
  private httpClient: HttpClient;

  constructor(baseUrl: string) {
    this.httpClient = new HttpClient(baseUrl);
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    // Validate payload
    if (!payload.email || !payload.password) {
      throw new Error(
        JSON.stringify({
          i18n: 'missing_credentials',
          message: 'Email and password are required',
          statusCode: 400,
        }),
      );
    }

    const response = await this.httpClient.post<BackendLoginResponse>('/auth/login', payload);

    return this.mapBackendLoginResponseToDomain(response);
  }

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    if (!payload.accountCode || !payload.email || !payload.password) {
      throw new Error(
        JSON.stringify({
          i18n: 'missing_fields',
          message: 'Account code, email, and password are required',
          statusCode: 400,
        }),
      );
    }

    const response = await this.httpClient.post<BackendRegisterResponse>('/auth/register', payload);

    return {
      account: new AccountEntity(response.account),
    };
  }

  async forgotPassword(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    // Validate payload
    if (!payload.email) {
      throw new Error(
        JSON.stringify({
          i18n: 'missing_email',
          message: 'Email is required',
          statusCode: 400,
        }),
      );
    }

    await this.httpClient.post('/auth/forgot-password', payload);

    return {
      success: true,
      message: 'Password reset email sent successfully',
    };
  }

  async updateUserRole(payload: UpdateUserRoleRequest): Promise<UpdateUserRoleResponse> {
    if (!payload.userId || !payload.role) {
      throw new Error(
        JSON.stringify({
          i18n: 'missing_fields',
          message: 'User ID and role are required',
          statusCode: 400,
        }),
      );
    }

    const response = await this.httpClient.patch<BackendRegisterResponse>(
      '/auth/update-role',
      payload,
    );

    return {
      account: new AccountEntity(response.account),
    };
  }

  private mapBackendLoginResponseToDomain(response: BackendLoginResponse): LoginResponse {
    const account = new AccountEntity(response.account);
    const session = this.createAuthSession(response.token);

    return { account, session };
  }

  private createAuthSession(token: string): AuthSession {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return {
      token,
      expiresAt: expiresAt.toISOString(),
    };
  }
}
