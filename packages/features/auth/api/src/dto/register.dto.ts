import { ApiProperty } from '@nestjs/swagger';
import type { RegisterRequest } from '@piar/auth-configuration';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * Register DTO with Swagger decorators
 */
export class RegisterDto implements RegisterRequest {
  @ApiProperty({
    description: 'Unique account code',
    example: 'ACC-001',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @Matches(/^[A-Za-z0-9_-]+$/)
  accountCode!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@piar.com',
    type: String,
    format: 'email',
  })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'SecurePass123!',
    type: String,
    format: 'password',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
