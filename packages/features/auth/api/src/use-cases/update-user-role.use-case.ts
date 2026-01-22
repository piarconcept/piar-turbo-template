import type {
  IAuthRepository,
  UpdateUserRoleRequest,
  UpdateUserRoleResponse,
} from '@piar/auth-configuration';

export interface UpdateUserRoleUseCase {
  execute(payload: UpdateUserRoleRequest): Promise<UpdateUserRoleResponse>;
}

export const UpdateUserRoleUseCase = Symbol('UpdateUserRoleUseCase');

export class UpdateUserRoleUseCaseExecuter implements UpdateUserRoleUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(payload: UpdateUserRoleRequest): Promise<UpdateUserRoleResponse> {
    return this.repository.updateUserRole(payload);
  }
}
