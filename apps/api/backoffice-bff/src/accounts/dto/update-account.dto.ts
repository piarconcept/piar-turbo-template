import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAccountDto {
  @ApiPropertyOptional({
    description: 'Unique account code',
    example: 'PIAR_ADMIN',
  })
  accountCode?: string;

  @ApiPropertyOptional({
    description: 'Account email',
    example: 'admin@piarconcept.com',
  })
  email?: string | null;

  @ApiPropertyOptional({
    description: 'Account role',
    enum: ['admin', 'user'],
    example: 'admin',
  })
  role?: 'admin' | 'user';
}
