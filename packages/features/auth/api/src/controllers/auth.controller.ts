import { Body, Controller, Inject, Patch, Post } from '@nestjs/common';
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateUserRoleRequest,
  UpdateUserRoleResponse,
} from '@piar/auth-configuration';
import {
  ForgotPasswordUseCase,
  LoginUseCase,
  RegisterUseCase,
  UpdateUserRoleUseCase,
} from '../use-cases';

/**
 * Auth Controller (NestJS)
 * Provides authentication endpoints
 */
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(LoginUseCase)
    private readonly loginUseCase: LoginUseCase,
    @Inject(RegisterUseCase)
    private readonly registerUseCase: RegisterUseCase,
    @Inject(ForgotPasswordUseCase)
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    @Inject(UpdateUserRoleUseCase)
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase
  ) {}

  /**
   * POST /auth/login
   */
  @Post('login')
  async login(@Body() payload: LoginRequest): Promise<LoginResponse> {
    return this.loginUseCase.execute(payload);
  }

  /**
   * POST /auth/register
   */
  @Post('register')
  async register(@Body() payload: RegisterRequest): Promise<RegisterResponse> {
    return this.registerUseCase.execute(payload);
  }

  /**
   * POST /auth/forgot-password
   */
  @Post('forgot-password')
  async forgotPassword(
    @Body() payload: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    return this.forgotPasswordUseCase.execute(payload);
  }

  /**
   * PATCH /auth/roles
   */
  @Patch('roles')
  async updateUserRole(
    @Body() payload: UpdateUserRoleRequest
  ): Promise<UpdateUserRoleResponse> {
    return this.updateUserRoleUseCase.execute(payload);
  }
}
