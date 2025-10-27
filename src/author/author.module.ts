import { ContainerModule } from 'inversify';
import { AuthorRouter } from '@/author/presentation/routers/author.router';

export const AuthorModule = new ContainerModule(({ bind }) => {
  bind<AuthorRouter>(AuthorRouter.name).to(AuthorRouter).inSingletonScope();
});
