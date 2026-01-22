import { DynamicModule, Module } from '@nestjs/common';
import { AuthRepository } from '@piar/auth-infra-backend';
import { AuthController } from '../controllers/auth.controller';
import {
  ForgotPasswordUseCase,
  ForgotPasswordUseCaseExecuter,
  LoginUseCase,
  LoginUseCaseExecuter,
  RegisterUseCase,
  RegisterUseCaseExecuter,
  UpdateUserRoleUseCase,
  UpdateUserRoleUseCaseExecuter,
} from '../use-cases';

/**
 * Auth Module (NestJS)
 * Module for authentication functionality
 */
@Module({
  controllers: [AuthController],
})
export class AuthModule {
  static register(): DynamicModule {
    return {
      module: AuthModule,
      imports: [],
      providers: [
        AuthRepository,
        {
          provide: LoginUseCase,
          useFactory: (repository: AuthRepository) =>
            new LoginUseCaseExecuter(repository),
          inject: [AuthRepository],
        },
        {
          provide: RegisterUseCase,
          useFactory: (repository: AuthRepository) =>
            new RegisterUseCaseExecuter(repository),
          inject: [AuthRepository],
        },
        {
          provide: ForgotPasswordUseCase,
          useFactory: (repository: AuthRepository) =>
            new ForgotPasswordUseCaseExecuter(repository),
          inject: [AuthRepository],
        },
        {
          provide: UpdateUserRoleUseCase,
          useFactory: (repository: AuthRepository) =>
            new UpdateUserRoleUseCaseExecuter(repository),
          inject: [AuthRepository],
        },
      ],
      exports: [],
    };
  }
}
