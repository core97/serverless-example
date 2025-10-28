import { ContainerModule } from 'inversify';
import { BookRepo } from '@/book/domain/repositories/book.repository';
import { PrismaBookRepo } from '@/book/infra/prisma-book.repository';
import { BookRouter } from '@/book/presentation/routers/book.router';

export const BookModule = new ContainerModule(({ bind }) => {
  bind<BookRepo>(BookRepo.name).to(PrismaBookRepo).inSingletonScope();
  bind<BookRouter>(BookRouter.name).to(BookRouter).inSingletonScope();
});
