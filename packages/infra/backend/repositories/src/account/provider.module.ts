import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRepository } from './repository';
import { AccountPort } from '@piar/domain-models';
import { AccountOrmEntity } from './orm.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AccountOrmEntity])],
  providers: [
    {
      provide: AccountPort,
      useClass: AccountRepository,
    },
  ],
  exports: [AccountPort, TypeOrmModule.forFeature([AccountOrmEntity])],
})
export class AccountRepositoryProviderModule {}
