import { ContainerModule } from 'inversify';
import { BookRouter } from '@/book/presentation/routers/book.router';

export const BookModule = new ContainerModule(({ bind }) => {
  bind<BookRouter>(BookRouter.name).to(BookRouter).inSingletonScope();
});
