import type { IAuthRepository, LoginRequest, LoginResponse } from '@piar/auth-configuration';

export interface LoginUseCase {
  execute(payload: LoginRequest): Promise<LoginResponse>;
}

export const LoginUseCase = Symbol('LoginUseCase');

export class LoginUseCaseExecuter implements LoginUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(payload: LoginRequest): Promise<LoginResponse> {
    return this.repository.login(payload);
  }
}
