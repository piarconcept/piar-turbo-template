import { ApiProperty } from '@nestjs/swagger';
import type { ForgotPasswordRequest } from '@piar/auth-configuration';

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
  email!: string;
}
