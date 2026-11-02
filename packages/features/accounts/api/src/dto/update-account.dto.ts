import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateAccountDto {
  @ApiPropertyOptional({
    description: 'Unique account code',
    example: 'PIAR_ADMIN',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @Matches(/^[A-Za-z0-9_-]+$/)
  accountCode?: string;

  @ApiPropertyOptional({
    description: 'Account email',
    example: 'admin@piarconcept.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string | null;

  @ApiPropertyOptional({
    description: 'Account role',
    enum: ['admin', 'user'],
    example: 'admin',
  })
  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: 'admin' | 'user';
}
