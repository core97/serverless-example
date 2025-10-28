import { ContainerModule } from 'inversify';
import { AuthorCreation } from '@/author/application/author-creation.use-case';
import { AuthorRouter } from '@/author/presentation/routers/author.router';
import { AuthorCreationCron } from '@/author/presentation/crons/author-creation.cron';

export const AuthorModule = new ContainerModule(({ bind }) => {
  bind<AuthorCreation>(AuthorCreation.name).to(AuthorCreation).inSingletonScope();

  bind<AuthorRouter>(AuthorRouter.name).to(AuthorRouter).inSingletonScope();

  bind<AuthorCreationCron>(AuthorCreationCron.name).to(AuthorCreationCron).inSingletonScope();
});
