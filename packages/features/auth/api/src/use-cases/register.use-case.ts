import type { IAuthRepository, RegisterRequest, RegisterResponse } from '@piar/auth-configuration';

export interface RegisterUseCase {
  execute(payload: RegisterRequest): Promise<RegisterResponse>;
}

export const RegisterUseCase = Symbol('RegisterUseCase');

export class RegisterUseCaseExecuter implements RegisterUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(payload: RegisterRequest): Promise<RegisterResponse> {
    return this.repository.register(payload);
  }
}
