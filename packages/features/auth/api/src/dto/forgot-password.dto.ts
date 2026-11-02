import { ApiProperty } from '@nestjs/swagger';
import type { ForgotPasswordRequest } from '@piar/auth-configuration';
import { IsEmail, MaxLength } from 'class-validator';

/**
 * Forgot Password DTO with Swagger decorators
 */
export class ForgotPasswordDto implements ForgotPasswordRequest {
  @ApiProperty({
    description: 'Email address to send password reset link',
    example: 'user@piar.com',
    type: String,
    format: 'email',
  })
  @IsEmail()
  @MaxLength(254)
  email!: string;
}
