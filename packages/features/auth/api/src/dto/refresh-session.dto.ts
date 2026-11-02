import { ApiProperty } from '@nestjs/swagger';
import type { RefreshSessionRequest } from '@piar/auth-configuration';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RefreshSessionDto implements RefreshSessionRequest {
  @ApiProperty({
    description: 'Refresh token issued at login',
    type: String,
  })
  @IsString()
  @MinLength(20)
  @MaxLength(8192)
  refreshToken!: string;
}
