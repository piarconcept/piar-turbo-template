import { ApiProperty } from '@nestjs/swagger';
import type { LoginRequest } from '@piar/auth-configuration';
import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Login DTO with Swagger decorators
 */
export class LoginDto implements LoginRequest {
  @ApiProperty({
    description: 'User email address',
    example: 'admin@piar.com',
    type: String,
  })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({
    description: 'User password',
    example: 'admin123',
    type: String,
    format: 'password',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;

  @ApiProperty({
    description: 'Persist session with refresh token',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
