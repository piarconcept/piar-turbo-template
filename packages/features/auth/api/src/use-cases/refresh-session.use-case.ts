import type { AuthSession, IAuthRepository, RefreshSessionRequest } from '@piar/auth-configuration';

export interface RefreshSessionUseCase {
  execute(payload: RefreshSessionRequest): Promise<AuthSession>;
}

export const RefreshSessionUseCase = Symbol('RefreshSessionUseCase');

export class RefreshSessionUseCaseExecuter implements RefreshSessionUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(payload: RefreshSessionRequest): Promise<AuthSession> {
    return this.repository.refresh(payload);
  }
}
