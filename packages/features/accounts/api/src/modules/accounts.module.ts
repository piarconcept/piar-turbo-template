import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AccountPort } from '@piar/domain-models';
import { AccountsController } from '../controllers';
import {
  DeleteAccountUseCase,
  DeleteAccountUseCaseExecuter,
  GetAccountUseCase,
  GetAccountUseCaseExecuter,
  ListAccountsUseCase,
  ListAccountsUseCaseExecuter,
  UpdateAccountUseCase,
  UpdateAccountUseCaseExecuter,
} from '../use-cases';

export interface AccountsModuleOptions {
  accountPort: Provider<AccountPort>;
}

@Module({
  controllers: [AccountsController],
})
export class AccountsModule {
  static register(options: AccountsModuleOptions): DynamicModule {
    return {
      module: AccountsModule,
      imports: [],
      providers: [
        options.accountPort,
        ListAccountsUseCaseExecuter,
        {
          provide: ListAccountsUseCase,
          useExisting: ListAccountsUseCaseExecuter,
        },
        GetAccountUseCaseExecuter,
        {
          provide: GetAccountUseCase,
          useExisting: GetAccountUseCaseExecuter,
        },
        UpdateAccountUseCaseExecuter,
        {
          provide: UpdateAccountUseCase,
          useExisting: UpdateAccountUseCaseExecuter,
        },
        DeleteAccountUseCaseExecuter,
        {
          provide: DeleteAccountUseCase,
          useExisting: DeleteAccountUseCaseExecuter,
        },
      ],
      exports: [],
    };
  }
}
