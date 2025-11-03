import { ContainerModule } from 'inversify';
import { AuthorRepo } from '@/author/domain/repositories/author.repository';
import { MemoryAuthorRepo } from '@/author/infra/memory-author.repository';
import { AuthorCreation } from '@/author/application/author-creation.use-case';
import { AuthorRouter } from '@/author/presentation/routers/author.router';
import { AuthorsListCron } from '@/author/presentation/crons/authors-list.cron';

export const AuthorModule = new ContainerModule(({ bind }) => {
  bind<AuthorRepo>(AuthorRepo.name).to(MemoryAuthorRepo).inSingletonScope();

  bind<AuthorCreation>(AuthorCreation.name).to(AuthorCreation).inSingletonScope();

  bind<AuthorRouter>(AuthorRouter.name).to(AuthorRouter).inSingletonScope();

  bind<AuthorsListCron>(AuthorsListCron.name).to(AuthorsListCron).inSingletonScope();
});
