import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AuthRepository } from '@piar/auth-infra-backend';
import {
  JwtTokenService,
  SecurityModule,
} from '@piar/infra-backend-common-security';
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
import { AccountPort } from '@piar/domain-models';

export interface AuthModuleOptions {
  accountPort: Provider<AccountPort>;
}

@Module({
  controllers: [AuthController],
})
export class AuthModule {
  static register(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        SecurityModule.register({
          secret: process.env.JWT_SECRET ?? 'change-me',
          expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
        }),
      ],
      providers: [
        {
          provide: AuthRepository,
          useFactory: (accountPort: AccountPort, tokenService: JwtTokenService) =>
            new AuthRepository(accountPort, tokenService),
          inject: [AccountPort, JwtTokenService],
        },
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
        ...Object.values(options),
      ],
      exports: [],
    };
  }
}
