import { ContainerModule } from 'inversify';
import { BookRepo } from '@/book/domain/repositories/book.repository';
import { MemoryBookRepo } from '@/book/infra/memory-book.repository';
import { PublishedBook } from '@/book/presentation/events/published-book.event';
import { BookRouter } from '@/book/presentation/routers/book.router';

export const BookModule = new ContainerModule(({ bind }) => {
  bind<BookRepo>(BookRepo.name).to(MemoryBookRepo).inSingletonScope();

  bind<PublishedBook>(PublishedBook.name).to(PublishedBook).inSingletonScope();

  bind<BookRouter>(BookRouter.name).to(BookRouter).inSingletonScope();
});
