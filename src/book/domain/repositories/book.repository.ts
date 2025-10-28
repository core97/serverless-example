import { PaginationParams, PaginationResult } from '@/shared/domain/types/pagination.type';
import { Book } from '@/book/domain/entities/book.entity';

export abstract class BookRepo {
  abstract create: (params: Book) => Promise<Book>;

  abstract deleteOneById: (id: Book['id']) => Promise<void>;

  abstract findMany: (
    filters: Partial<PaginationParams & Pick<Book, 'title' | 'authorId'>>,
  ) => Promise<PaginationResult<Book>>;

  abstract findOneById: (id: Book['id']) => Promise<Book | null>;

  abstract updateOneById: (
    id: Book['id'],
    params: Partial<Pick<Book, 'authorId' | 'title'>>,
  ) => Promise<Book>;
}
