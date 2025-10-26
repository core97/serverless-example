import { ContainerModule } from 'inversify';
import { AuthorRouter } from '@/book/presentation/routers/author.router';
import { BookRouter } from '@/book/presentation/routers/book.router';

export const BookModule = new ContainerModule(({ bind }) => {
  bind<AuthorRouter>(AuthorRouter.name).to(AuthorRouter).inSingletonScope();
  bind<BookRouter>(BookRouter.name).to(BookRouter).inSingletonScope();
});
