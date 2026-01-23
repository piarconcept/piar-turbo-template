import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtTokenService } from './jwt/jwt-token.service';

export interface SecurityModuleOptions {
  secret: string;
  expiresIn?: string | number;
}

@Module({})
export class SecurityModule {
  static register(options: SecurityModuleOptions): DynamicModule {
    return {
      module: SecurityModule,
      imports: [
        JwtModule.register({
          secret: options.secret,
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [JwtTokenService, JwtAuthGuard],
      exports: [JwtTokenService, JwtAuthGuard, JwtModule],
    };
  }
}
