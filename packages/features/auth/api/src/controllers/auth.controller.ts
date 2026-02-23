import { Body, Controller, Inject, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import type {
  ForgotPasswordResponse,
  LoginResponse,
  AuthSession,
  RegisterResponse,
  UpdateUserRoleResponse,
} from '@piar/auth-configuration';
import {
  ForgotPasswordUseCase,
  LoginUseCase,
  RefreshSessionUseCase,
  RegisterUseCase,
  UpdateUserRoleUseCase,
} from '../use-cases';
import {
  LoginDto,
  RefreshSessionDto,
  RegisterDto,
  ForgotPasswordDto,
  UpdateUserRoleDto,
} from '../dto';

/**
 * Auth Controller (NestJS)
 * Provides authentication endpoints
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(LoginUseCase)
    private readonly loginUseCase: LoginUseCase,
    @Inject(RefreshSessionUseCase)
    private readonly refreshSessionUseCase: RefreshSessionUseCase,
    @Inject(RegisterUseCase)
    private readonly registerUseCase: RegisterUseCase,
    @Inject(ForgotPasswordUseCase)
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    @Inject(UpdateUserRoleUseCase)
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
  ) {}

  /**
   * POST /auth/login
   */
  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Authenticate user with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful, returns account and session token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials (INVALID_CREDENTIALS)' })
  @ApiResponse({ status: 404, description: 'Account not found (NOT_FOUND)' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async login(@Body() payload: LoginDto): Promise<LoginResponse> {
    return this.loginUseCase.execute(payload);
  }

  /**
   * POST /auth/refresh
   */
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh session token', description: 'Refresh access token' })
  @ApiBody({ type: RefreshSessionDto })
  @ApiResponse({ status: 200, description: 'Session refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token (INVALID_REFRESH_TOKEN)' })
  async refresh(@Body() payload: RefreshSessionDto): Promise<AuthSession> {
    return this.refreshSessionUseCase.execute(payload);
  }

  /**
   * POST /auth/register
   */
  @Post('register')
  @ApiOperation({ summary: 'User registration', description: 'Register a new user account' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 409,
    description: 'Email or account code already exists (RESOURCE_ALREADY_EXISTS)',
  })
  @ApiResponse({ status: 400, description: 'Validation error (VALIDATION_ERROR)' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(@Body() payload: RegisterDto): Promise<RegisterResponse> {
    return this.registerUseCase.execute(payload);
  }

  /**
   * POST /auth/forgot-password
   */
  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password', description: 'Request password reset for a user' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'Email not found (NOT_FOUND)' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async forgotPassword(@Body() payload: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
    return this.forgotPasswordUseCase.execute(payload);
  }

  /**
   * PATCH /auth/roles
   */
  @Patch('roles')
  @ApiOperation({
    summary: 'Update user role',
    description: 'Update the role of an existing user (admin only)',
  })
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found (NOT_FOUND)' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions (FORBIDDEN)' })
  @ApiResponse({ status: 400, description: 'Validation error (VALIDATION_ERROR)' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateUserRole(@Body() payload: UpdateUserRoleDto): Promise<UpdateUserRoleResponse> {
    return this.updateUserRoleUseCase.execute(payload);
  }
}
