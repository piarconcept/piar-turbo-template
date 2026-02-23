import { ApiProperty } from '@nestjs/swagger';
import type { RefreshSessionRequest } from '@piar/auth-configuration';

export class RefreshSessionDto implements RefreshSessionRequest {
  @ApiProperty({
    description: 'Refresh token issued at login',
    type: String,
  })
  refreshToken!: string;
}
