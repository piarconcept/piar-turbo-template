import { Module } from '@nestjs/common';
import { AccountRepository } from './repository';
import { AccountPort } from '@piar/domain-models';

@Module({
  providers: [
    {
      provide: AccountPort,
      useClass: AccountRepository,
    },
  ],
  exports: [AccountPort],
})
export class AccountRepositoryProviderModule {}
