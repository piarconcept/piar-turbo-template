import { ApiProperty } from '@nestjs/swagger';
import type { UpdateUserRoleRequest, AccountRole } from '@piar/auth-configuration';
import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Update User Role DTO with Swagger decorators
 */
export class UpdateUserRoleDto implements UpdateUserRoleRequest {
  @ApiProperty({
    description: 'User ID to update',
    example: '1',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  userId!: string;

  @ApiProperty({
    description: 'New role for the user',
    example: 'admin',
    enum: ['admin', 'user'],
    type: String,
  })
  @IsIn(['admin', 'user'])
  role!: AccountRole;
}
