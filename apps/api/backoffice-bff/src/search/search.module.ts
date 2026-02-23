import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import {
  SearchBackofficeUseCase,
  SearchBackofficeUseCaseExecuter,
} from './use-cases/search-backoffice.use-case';

@Module({
  controllers: [SearchController],
  providers: [
    SearchBackofficeUseCaseExecuter,
    {
      provide: SearchBackofficeUseCase,
      useExisting: SearchBackofficeUseCaseExecuter,
    },
  ],
})
export class SearchModule {}
