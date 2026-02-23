import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt';
import { AdminGuard } from './guards/admin.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtTokenService } from './jwt/jwt-token.service';

export interface SecurityModuleOptions {
  secret: string;
  expiresIn?: string | number;
}

@Global()
@Module({})
export class SecurityModule {
  static register(options: SecurityModuleOptions): DynamicModule {
    return {
      module: SecurityModule,
      imports: [
        JwtModule.register({
          secret: options.secret,
          signOptions: {
            expiresIn: (options.expiresIn ?? '1d') as JwtSignOptions['expiresIn'],
          },
        }),
      ],
      providers: [JwtTokenService, JwtAuthGuard, AdminGuard],
      exports: [JwtTokenService, JwtAuthGuard, AdminGuard, JwtModule],
    };
  }
}
