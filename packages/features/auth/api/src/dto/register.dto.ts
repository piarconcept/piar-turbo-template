import { ApiProperty } from '@nestjs/swagger';
import type { RegisterRequest } from '@piar/auth-configuration';

/**
 * Register DTO with Swagger decorators
 */
export class RegisterDto implements RegisterRequest {
  @ApiProperty({
    description: 'Unique account code',
    example: 'ACC-001',
    type: String,
  })
  accountCode!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@piar.com',
    type: String,
    format: 'email',
  })
  email!: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'SecurePass123!',
    type: String,
    format: 'password',
    minLength: 8,
  })
  password!: string;
}
