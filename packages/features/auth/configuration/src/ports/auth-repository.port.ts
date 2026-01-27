import type { AccountEntity, AccountEntityProps } from '@piar/domain-models';

/**
 * Auth role representation based on the Account entity.
 */
export type AccountRole = NonNullable<AccountEntityProps['role']>;

/**
 * Session payload returned after authentication.
 */
export interface AuthSession {
  token: string;
  refreshToken?: string;
  expiresAt: string;
}

/**
 * Login request payload.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response payload.
 */
export interface LoginResponse {
  account: AccountEntity;
  session: AuthSession;
}

/**
 * Register request payload.
 */
export interface RegisterRequest {
  accountCode: string;
  email: string;
  password: string;
}

/**
 * Register response payload.
 */
export interface RegisterResponse {
  account: AccountEntity;
}

/**
 * Forgot password request payload.
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Forgot password response payload.
 */
export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

/**
 * Update user role request payload.
 */
export interface UpdateUserRoleRequest {
  userId: string;
  role: AccountRole;
}

/**
 * Update user role response payload.
 */
export interface UpdateUserRoleResponse {
  account: AccountEntity;
}

/**
 * Auth repository port (interface)
 * This defines the contract that any auth implementation must follow
 */
export interface IAuthRepository {
  /**
   * Authenticate a user with credentials.
   */
  login(payload: LoginRequest): Promise<LoginResponse>;

  /**
   * Register a new user.
   */
  register(payload: RegisterRequest): Promise<RegisterResponse>;

  /**
   * Trigger forgot password flow.
   */
  forgotPassword(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse>;

  /**
   * Update the role of a user.
   */
  updateUserRole(payload: UpdateUserRoleRequest): Promise<UpdateUserRoleResponse>;
}

export const IAuthRepository = Symbol('IAuthRepository');
