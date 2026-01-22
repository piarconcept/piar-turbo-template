import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  IAuthRepository,
} from '@piar/auth-configuration';

export interface ForgotPasswordUseCase {
  execute(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse>;
}

export const ForgotPasswordUseCase = Symbol('ForgotPasswordUseCase');

export class ForgotPasswordUseCaseExecuter implements ForgotPasswordUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return this.repository.forgotPassword(payload);
  }
}
