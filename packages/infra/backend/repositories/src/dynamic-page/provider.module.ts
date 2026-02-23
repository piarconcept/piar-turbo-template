import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicPagePort } from '@piar/domain-models';
import { DynamicPageRepository } from './repository';
import { DynamicPageOrmEntity } from './orm.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DynamicPageOrmEntity])],
  providers: [
    {
      provide: DynamicPagePort,
      useClass: DynamicPageRepository,
    },
  ],
  exports: [DynamicPagePort, TypeOrmModule.forFeature([DynamicPageOrmEntity])],
})
export class DynamicPageRepositoryProviderModule {}
