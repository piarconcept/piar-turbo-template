import { ApiProperty } from '@nestjs/swagger';
import type { UpdateUserRoleRequest, AccountRole } from '@piar/auth-configuration';

/**
 * Update User Role DTO with Swagger decorators
 */
export class UpdateUserRoleDto implements UpdateUserRoleRequest {
  @ApiProperty({
    description: 'User ID to update',
    example: '1',
    type: String,
  })
  userId!: string;

  @ApiProperty({
    description: 'New role for the user',
    example: 'admin',
    enum: ['admin', 'user'],
    type: String,
  })
  role!: AccountRole;
}
