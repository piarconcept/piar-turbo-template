import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactSubmissionRepository } from './repository';
import { ContactSubmissionOrmEntity } from './orm.entity';
import { ContactSubmissionPort } from '@piar/domain-models';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ContactSubmissionOrmEntity])],
  providers: [
    {
      provide: ContactSubmissionPort,
      useClass: ContactSubmissionRepository,
    },
  ],
  exports: [ContactSubmissionPort, TypeOrmModule.forFeature([ContactSubmissionOrmEntity])],
})
export class ContactSubmissionRepositoryProviderModule {}
