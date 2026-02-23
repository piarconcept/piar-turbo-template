import { ApiProperty } from '@nestjs/swagger';
import type { LoginRequest } from '@piar/auth-configuration';

/**
 * Login DTO with Swagger decorators
 */
export class LoginDto implements LoginRequest {
  @ApiProperty({
    description: 'User email address',
    example: 'admin@piar.com',
    type: String,
  })
  email!: string;

  @ApiProperty({
    description: 'User password',
    example: 'admin123',
    type: String,
    format: 'password',
  })
  password!: string;

  @ApiProperty({
    description: 'Persist session with refresh token',
    example: true,
    type: Boolean,
    required: false,
  })
  rememberMe?: boolean;
}
